import json
import subprocess

import click

import datalake
from datalake import models


def _execute_program(app, program, end_log_function, log_key, options=(), timeout=None):
    error_message = None
    args = ["python", "-m", program]
    args.extend(options)
    try:
        subprocess.run(args, stderr=subprocess.PIPE, check=True, timeout=timeout)
    except subprocess.CalledProcessError as called_process_error:
        error_message = called_process_error.stderr
    except OSError as os_error:
        error_message = "INTERNAL ERROR: %s" % str(os_error)
    except subprocess.TimeoutExpired as timeout_error:
        error_message = "TIMEOUT EXPIRED: %s" % str(timeout_error)
    finally:
        _call_models_function(app, end_log_function, log_key, error_message=error_message)


def _call_models_function(app, func, *args, **kwargs):
    with app.app_context():
        return func(*args, **kwargs)


def _process_acquires(app, execution_key, acquire_program_key, acquires):
    acquire_program = {row["AcquireProgramKey"]: row["AcquireProgramPythonName"]
                       for row in _call_models_function(app, models.get_acquire_programs)}[acquire_program_key]
    for acquire in acquires:
        options = acquire.get("options", [])
        acquire_key = _call_models_function(app, models.start_acquire_log, execution_key, options=options)["AcquireKey"]
        _execute_program(app, acquire_program, models.end_acquire_log, acquire_key, options=options,
                         timeout=app.config.get("DATALAKE_ACQUIRE_TIMEOUT"))


def _process_extract(app, execution_key, extract_destination, options):
    extract_key = _call_models_function(app, models.start_extract_log, execution_key, options=options)["AcquireKey"]
    _execute_program(app, extract_destination, models.end_extract_log, extract_key, options=options,
                     timeout=app.config.get("DATALAKE_EXTRACT_TIMEOUT"))


@click.command
@click.option("-f", "--config-file", type=click.File(), help="The configuration file (use - for stdin) containing the "
              "JSON formatted execution details")
def main(config_file):
    data = json.loads(config_file.read())
    execution, acquires, extract = data["execution"], data["acquires"], data["extract"]
    acquire_program_key = execution.get("acquire_program_key")
    extract_destination = extract.get("extract_destination")

    app = datalake.create_app()
    execution_key = _call_models_function(app, models.start_execution_log,
                                          scheduled_execution_key=execution.get("scheduled_execution_key"),
                                          acquire_program_key=acquire_program_key,
                                          client_name=execution.get("client_name"),
                                          data_set_name=execution.get("data_set_name"),
                                          load_date=execution.get("load_date"),
                                          ad_hoc_user=execution.get("ad_hoc_user"))["ExecutionKey"]

    error = None
    try:
        if acquire_program_key is not None:
            _process_acquires(app, execution_key, acquire_program_key, acquires)
        if extract_destination is not None:
            _process_extract(app, execution_key, extract_destination, extract.get("options", []))
    except Exception as error:
        error = error
    finally:
        _call_models_function(app, models.end_execution_log, execution_key)
        if error is not None:
            raise error
