from datalake import app, models
import datalake


def _clean_up_containers(flask_app):
    pass


def _clean_up_logs(flask_app):
    pass


def _kill_long_running_containers(flask_app):
    pass


def _process_queue(flask_app):
    with flask_app.app_context():
        for execution in models.get_queue():
            rows = models.get_scheduled_execution(execution["ScheduledExecutionKey"])
            app.execute(app.format_execution(rows))


def main():
    flask_app = datalake.create_app("orchestrate")
    flask_app.logger.info("Orchestrator started")
    flask_app.logger.info("Cleaning up completed container instances...")
    _clean_up_containers(flask_app)
    flask_app.logger.info("Checking for long-running container instances")
    _kill_long_running_containers(flask_app)
    flask_app.logger.info("Checking for uncompleted logs")
    _clean_up_logs(flask_app)
    flask_app.logger.info("Processing queue...")
    _process_queue(flask_app)
    flask_app.logger.info("Orchestrator ended")
