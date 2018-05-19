import os

from azure.storage import blob

import datalake

# allow an acquire program to upload more than one file?

class AcquireProgram(object):
    def __init__(self):
        self._app = datalake.create_app()
        self._blob_service = blob.BlockBlobService(account_name=self._app.config["DATALAKE_AZURE_BLOB_ACCOUNT_NAME"],
                                                   sas_token=self._app.config["DATALAKE_AZURE_BLOB_SAS_TOKEN"])
        self._blob_prefix = os.environ.get("DATALAKE_PREFIX")
        self._file_name_params = {
            "DATALAKE_CLIENT_NAME": os.environ.get("DATALAKE_CLIENT_NAME"),
            "DATALAKE_DATA_SOURCE_NAME": os.environ.get("DATALAKE_DATA_SOURCE_NAME"),
            "DATALAKE_DATA_SET_NAME": os.environ.get("DATALAKE_DATA_SET_NAME")
        }
        self.file_name = "{DATALAKE_DATA_SOURCE_NAME}_{DATALAKE_LOAD_DATE}"
        self.logger = self._app.logger

    def create_blob_from_stream(self, stream, count=None, **file_name_params):
        blob_name = self._blob_prefix + "/" + self.file_name.format(**self._file_name_params, **file_name_params)
        self._blob_service.create_blob_from_stream(self._app.config["DATALAKE_AZURE_BLOB_CONTAINER_NAME"], blob_name,
                                                   stream, count=count)
