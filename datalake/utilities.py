import datalake

# allow an acquire program to upload more than one file?

class AcquireProgram(object):
    def __init__(self):
        self.app = datalake.create_app()
        self.logger = self.app.logger
