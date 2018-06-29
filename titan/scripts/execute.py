import os

import json
import subprocess

from titan import models
import titan


def _execute_program(flask_app, program, end_log_function, log_key, options=(), timeout=None):
    error_message = None
    args = [program]
    args.extend(options)
    print(options)
    try:
        subprocess.run(args, stderr=subprocess.PIPE, check=True, timeout=timeout)
    except subprocess.CalledProcessError as called_process_error:
        error_message = str(called_process_error.stderr)
    except OSError as os_error:
        error_message = "INTERNAL ERROR: %s" % str(os_error)
    except subprocess.TimeoutExpired as timeout_error:
        error_message = "TIMEOUT EXPIRED: %s" % str(timeout_error)
    finally:
        _call_models_function(flask_app, end_log_function, log_key, error_message=error_message)


def _call_models_function(flask_app, func, *args, **kwargs):
    with flask_app.app_context():
        return func(*args, **kwargs)


def _process_acquire(flask_app, execution_key, acquire_program, acquire, load_date):
    acquire["ExecutionKey"] = execution_key
    options = acquire.get("Options", [])
    options.append({"AcquireOptionName": "--load-date", "AcquireOptionValue": load_date})
    acquire_key = _call_models_function(flask_app, models.start_acquire_log, acquire)[0]["AcquireKey"]
    _execute_program(flask_app, acquire_program, models.end_acquire_log, acquire_key,
                     options=options, timeout=flask_app.config.get("TITAN_ACQUIRE_TIMEOUT_SECONDS"))


def _process_acquires(flask_app, data):
    execution = data["execution"]
    acquire_program_key = execution.get("AcquireProgramKey")
    acquire_programs = {row["AcquireProgramKey"]: row["AcquireProgramPythonName"]
                        for row in _call_models_function(flask_app, models.get_acquire_programs)}
    acquire_program = acquire_programs[acquire_program_key]
    execution_key = execution["ExecutionKey"]
    load_date = execution.get("ExecutionLoadDate")
    acquires = data["acquires"]
    for acquire in acquires:
        _process_acquire(flask_app, execution_key, acquire_program, acquire=acquire, load_date=load_date)


def _process_extract(flask_app, execution_key, data):
    extract = data["extract"]
    extract["ExecutionKey"] = execution_key
    extract_key = extract["ExtractKey"] = _call_models_function(flask_app, models.start_extract_log,
                                                                extract)["ExtractKey"]
    _update_env_var(data)
    options = extract.get("Options")
    _execute_program(flask_app, extract.get("ExtractDestination"), models.end_extract_log, extract_key, options=options,
                     timeout=flask_app.config.get("TITAN_EXTRACT_TIMEOUT_SECONDS"))


def _update_env_var(data):
    os.putenv("TITAN_STDIN", json.dumps(data))


def main():
    flask_app = titan.create_app("execute")
    data = json.loads(os.getenv("TITAN_STDIN"))
    execution = data["execution"]
    execution_key = execution["ExecutionKey"]
    error = None
    try:
        if data.get("acquires"):
            flask_app.logger.info("Processing acquires...")
            _process_acquires(flask_app, data)
        if data.get("extract"):
            flask_app.logger.info("Processing extract...")
            _process_extract(flask_app, execution_key, data)
    except Exception as exception:
        error = exception
    finally:
        error_message = str(error) if error is not None else None
        _call_models_function(flask_app, models.end_execution_log, execution_key, error_message=error_message)
        flask_app.logger.info("Ending execution log")
        if error is not None:
            raise error
