import os

import json
import subprocess

from datalake import models
import datalake


def _execute_program(flask_app, program, end_log_function, log_key, options=(), timeout=None):
    error_message = None
    args = program.split(" ")
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
        _call_models_function(flask_app, end_log_function, log_key, error_message=error_message)


def _call_models_function(flask_app, func, *args, **kwargs):
    with flask_app.flask_app_context():
        return func(*args, **kwargs)


def _process_acquires(flask_app, execution_key, acquire_program_key, acquires):
    acquire_program = {row["AcquireProgramKey"]: row["AcquireProgramPythonName"]
                       for row in _call_models_function(flask_app, models.get_acquire_programs)}[acquire_program_key]
    for acquire in acquires:
        options = acquire.get("options")
        acquire_key = _call_models_function(flask_app, models.start_acquire_log, execution_key,
                                            options=options)["AcquireKey"]
        _execute_program(flask_app, "python -m %s" % acquire_program, models.end_acquire_log, acquire_key,
                         options=options, timeout=flask_app.config.get("DATALAKE_ACQUIRE_TIMEOUT_SECONDS"))


def _process_extract(flask_app, execution_key, extract_destination, options, prefix):
    extract_key = _call_models_function(flask_app, models.start_extract_log, execution_key, extract_destination,
                                        options=options)["AcquireKey"]
    options["--blob-prefix"] = prefix
    _execute_program(flask_app, extract_destination, models.end_extract_log, extract_key, options=options,
                     timeout=flask_app.config.get("DATALAKE_EXTRACT_TIMEOUT_SECONDS"))


def main():
    data = json.loads(os.getenv("DATALAKE_EXECUTE_STDIN"))
    execution = data["execution"]
    acquires = data["acquires"]
    extract = data["extract"]
    acquire_program_key = execution.get("acquire_program_key")
    client_name = execution.get("client_name")
    data_source_name = execution.get("data_source_name")
    data_set_name = execution.get("data_set_name")
    load_date = execution.get("load_date")
    prefix = "/".join((client_name, data_source_name, data_set_name, load_date))
    extract_destination = extract.get("extract_destination")

    flask_app = datalake.create_app()
    execution_key = _call_models_function(flask_app, models.start_execution_log,
                                          scheduled_execution_key=execution.get("scheduled_execution_key"),
                                          acquire_program_key=acquire_program_key,
                                          client_name=client_name,
                                          data_source_name=data_source_name,
                                          data_set_name=data_set_name,
                                          load_date=load_date,
                                          ad_hoc_user=execution.get("ad_hoc_user"))["ExecutionKey"]

    error = None
    try:
        if acquire_program_key is not None:
            _process_acquires(flask_app, execution_key, acquire_program_key, acquires)
        if extract_destination is not None:
            _process_extract(flask_app, execution_key, extract_destination, extract.get("options", {}), prefix=prefix)
    except Exception as error:
        error = error
    finally:
        _call_models_function(flask_app, models.end_execution_log, execution_key)
        if error is not None:
            raise error
