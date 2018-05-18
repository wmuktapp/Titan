import json
import uuid

import flask
from azure.common import credentials
from azure.mgmt import containerinstance
from azure.mgmt.containerinstance import models


class AzureSecurityContext(object):
    def __init__(self, subscription_id, client_id, client_secret, tenant):
        self.subscription_id = subscription_id
        self.credentials = credentials.ServicePrincipalCredentials(client_id, client_secret, tenant=tenant)


def _list_block_blobs(service, container, prefix):
    marker = None
    while marker != "":
        response = service.list_blobs(container, prefix=prefix, marker=marker)
        marker = response.next_marker
        for blob in response:
            yield blob


def list_block_blobs(service, container, prefix):
    blobs = _list_block_blobs(service, container, prefix)
    latest_version = max(int(blob.name.replace(prefix + "/v", "").split("/")[0]) for blob in blobs)
    return _list_block_blobs(service, container, prefix + "/v%s" % latest_version)


def execute(details):
    config = flask.current_app.config
    container_name = config["DATALAKE_AZURE_CONTAINER_NAME"]
    launch_container(
        security_context=config["DATALAKE_AZURE_SECURITY_CONTEXT"],
        resource_group_name=config["DATALAKE_AZURE_RESOURCE_GROUP_NAME"],
        container_group_prefix=container_name,
        os_type=config["DATALAKE_AZURE_CONTAINER_OS_TYPE"],
        location=config["DATALAKE_AZURE_CONTAINER_LOCATION"],
        container_name=container_name,
        image_name=config["DATALAKE_AZURE_CONTAINER_IMAGE_NAME"],
        memory_in_gb=config["DATALAKE_AZURE_CONTAINER_MEMORY_GB"],
        cpu_count=config["DATALAKE_AZURE_CONTAINER_CPU_COUNT"],
        configuration=json.dumps(details)
    )


def format_execution_details(rows, scheduled=False):
    arbitrary_row = rows[0]
    details = {
        "execution": {
            "scheduled_execution_key": arbitrary_row["ScheduledExecutionKey"],
            "acquire_program_key": arbitrary_row["AcquireProgramKey"],
            "client_name": arbitrary_row["ScheduledExecutionClientName" if scheduled else "ExecutionClientName"],
            "data_source_name": arbitrary_row["ScheduledExecutionDataSourceName" if scheduled
                                              else "ExecutionDataSourceName"],
            "data_set_name": arbitrary_row["ScheduledExecutionDataSetName" if scheduled else "ExecutionDataSetName"],
            "load_date": arbitrary_row["ScheduledExecutionLoadDate" if scheduled else "ExecutionLoadDate"],
            "ad_hoc_user": arbitrary_row["ScheduledExecutionUser" if scheduled else "AdHocUser"]
        },
        "acquires": [],
        "extract": {
            "extract_destination": arbitrary_row["ScheduledExtractDestination" if scheduled else "ExtractDestination"],
            "options": {}
        } if arbitrary_row["ScheduledExtractKey" if scheduled else "ExtractKey"] is not None else {}
    }
    acquires = {}
    for row in rows:
        acquire_key = row["AcquireKey"]
        if acquire_key is not None:
            acquire = acquires.get(acquire_key)
            if acquire is None:
                acquires[acquire_key] = {"options": {}}
            acquire_option_name = row["ScheduledAcquireOptionName" if scheduled else "AcquireOptionName"]
            if acquire_option_name is not None:
                acquire["options"][acquire_option_name] = row["ScheduledAcquireOptionValue" if scheduled
                                                              else "AcquireOptionValue"]
        extract_option_name = row["ScheduledExtractOptionName" if scheduled else "ExtractOptionName"]
        if extract_option_name is not None:
            details["extract"]["options"][extract_option_name] = row["ScheduledExtractOptionValue" if scheduled
                                                                     else "ExtractOptionValue"]
    details["acquires"].extend(acquires.values())
    return details


def launch_container(security_context, resource_group_name, container_group_prefix, os_type, location, container_name,
                     image_name, memory_in_gb, cpu_count, configuration):
    container_group_name = "%s_%s" % (container_group_prefix, uuid.uuid4())
    resources = models.ResourceRequirements(requests=models.ResourceRequests(memory_in_gb=memory_in_gb, cpu=cpu_count))
    container = models.Container(name=container_name, image=image_name, resources=resources, command=["execute"],
                                 environment_variables=models.EnvironmentVariable("DATALAKE_STDIN", configuration))
    container_group = models.ContainerGroup(containers=[container], os_type=os_type, location=location,
                                            restart_policy="Never")
    client = containerinstance.ContainerInstanceManagementClient(security_context.credentials,
                                                                 security_context.subscription_id)
    client.container_groups.create_or_update(resource_group_name, container_group_name, container_group)
