from datalake import app, models
import datalake


def _clean_up_containers(flask_app):
    pass


def _clean_up_logs(flask_app):
    pass


def _process_queue(flask_app):
    with flask_app.app_context():
        for execution in models.get_queue():
            rows = models.get_scheduled_execution(execution["ScheduledExecutionKey"])
            app.execute(app.format_execution(rows))


def main():
    flask_app = datalake.create_app()
    _clean_up_containers(flask_app)
    _clean_up_logs(flask_app)
    _process_queue(flask_app)
