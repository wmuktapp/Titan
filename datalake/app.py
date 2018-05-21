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


def list_blobs(service, container, prefix):
    marker = None
    while marker != "":
        response = service.list_blobs(container, prefix=prefix, marker=marker)
        marker = response.next_marker
        for blob in response:
            yield blob


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


def format_nested_execution(rows):
    arbitrary_row = rows[0]
    details = {
        "execution": {
            "ScheduledExecutionKey": arbitrary_row.get("ScheduledExecutionKey"),
            "AcquireProgramKey": arbitrary_row.get("AcquireProgramKey"),
            "ExecutionClientName": arbitrary_row.get("ExecutionClientName"),
            "ExecutionDataSourceName": arbitrary_row.get("ExecutionDataSourceName"),
            "ExecutionDataSetName": arbitrary_row.get("ExecutionDataSetName"),
            "ExecutionLoadDate": arbitrary_row.get("ExecutionLoadDate"),
            "ExecutionUser": arbitrary_row.get("ExecutionUser")
        },
        "acquires": [],
        "extract": {
            "ExtractDestination": arbitrary_row.get("ExtractDestination"),
            "Options": {}
        } if arbitrary_row.get("ExtractKey") is not None else {}
    }
    acquires = {}
    for row in rows:
        acquire_key = row.get("AcquireKey")
        if acquire_key is not None:
            acquire = acquires.get(acquire_key)
            if acquire is None:
                acquires[acquire_key] = {"Options": {}}
            acquire_option_name = row.get("AcquireOptionName")
            if acquire_option_name is not None:
                acquire["Options"][acquire_option_name] = row.get("AcquireOptionValue")
        extract_option_name = row.get("ExtractOptionName")
        if extract_option_name is not None:
            details["extract"]["Options"][extract_option_name] = row.get("ExtractOptionValue")
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
