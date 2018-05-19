from azure.storage import blob

import datalake

# allow an acquire program to upload more than one file?

class AcquireProgram(object):
    def __init__(self):
        self._app = datalake.create_app()
        self._blob_service = blob.BlockBlobService(account_name=self._app.config["DATALAKE_AZURE_BLOB_ACCOUNT_NAME"],
                                                   sas_token=self._app.config["DATALAKE_AZURE_BLOB_SAS_TOKEN"])
        self.logger = self.app.logger

    def create_blob_from_stream(self, stream, prefix, count=None):
        pass
