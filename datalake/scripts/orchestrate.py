from datalake import models
from datalake.api import views


def main():
    for execution in models.get_queue():
        details = models.get_schedule(execution["ScheduledExecutionKey"])
        # call views.execute