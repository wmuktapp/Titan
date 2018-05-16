import uuid

import flask
from azure.common import credentials
from azure.mgmt import containerinstance
from azure.mgmt.containerinstance import models


class _AzureSecurityContext(object):
    def __init__(self, subscription_id, client_id, client_secret, tenant):
        self.subscription_id = subscription_id
        self.credentials = credentials.ServicePrincipalCredentials(client_id, client_secret, tenant=tenant)


def launch_container(security_context, config_file):
    config = flask.current_app.config
    container_name = config["DATALAKE_AZURE_CONTAINER_NAME"]
    container_group_name = "%s_%s" % (container_name, uuid.uuid4())

    resources = models.ResourceRequirements(requests=models.ResourceRequests(
        memory_in_gb=config["DATALAKE_AZURE_CONTAINER_RAM_GB"],
        cpu=config["DATALAKE_AZURE_CONTAINER_CPU_COUNT"])
    )

    container = models.Container(
        name=container_name,
        image=config["DATALAKE_AZURE_CONTAINER_IMAGE_NAME"],
        resources=resources,
        command=["execute"],
        environment_variables=models.EnvironmentVariable("DATALAKE_EXECUTE_STDIN", config_file)
    )

    container_group = models.ContainerGroup(
        containers=[container],
        os_type=config["DATALAKE_AZURE_CONTAINER_OS_TYPE"],
        location=config["DATALAKE_AZURE_CONTAINER_LOCATION"],
        restart_policy="Never"
    )

    client = containerinstance.ContainerInstanceManagementClient(security_context.credentials,
                                                                 security_context.subscription_id)
    client.container_groups.create_or_update(config["DATALAKE_AZURE_RESOURCE_GROUP_NAME"], container_group_name,
                                             container_group)
