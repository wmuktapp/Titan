import datalake
from datalake import models
from datalake.api import views



def _clean_up_containers():
    pass


def _clean_up_logs():
    pass


def _process_queue():
    for execution in models.get_queue():
        details = models.get_schedule(execution["ScheduledExecutionKey"])
        views._execute(details)


def main():
    _process_queue()

