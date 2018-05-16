from datalake import models
from datalake.api import views
import datalake


def _call_models_function(app, func, *args, **kwargs):
    with app.app_context():
        return func(*args, **kwargs)


def _clean_up_containers(app):
    pass


def _clean_up_logs(app):
    pass


def _process_queue(app):
    for execution in _call_models_function(app, models.get_queue):
        details = _call_models_function(app, models.get_scheduled_execution, execution["ScheduledExecutionKey"])
        views._execute(details)


def main():
    app = datalake.create_app()
    _process_queue(app)
    _clean_up_containers(app)
    _clean_up_logs(app)
