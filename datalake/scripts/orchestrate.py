from datalake import models


def main():
    for execution in models.get_queue():
        details = models.get_schedule(execution["ScheduledExecutionKey"])
        # call execute api view func