import json
import subprocess

import click
import flask

from datalake import models


def _execute_program(program, options, end_log_function, log_key, timeout):
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
        end_log_function(log_key, error_message)


def _process_acquires(execution_key, acquire_program_key, acquires):
    acquire_program = {row["AcquireProgramKey"]: row["AcquireProgramPythonName"]
                       for row in models.get_acquire_programs()}[acquire_program_key]
    for acquire in acquires:
        acquire_options = acquire.get("options", [])
        acquire_key = models.start_acquire_log(execution_key, acquire_options)["AcquireKey"]
        _execute_program(acquire_program, acquire_options, models.end_acquire_log, acquire_key,
                         flask.current_app.config["DATALAKE_ACQUIRE_TIMEOUT"])


def _process_extract(execution_key, extract_destination, options):
    extract_key = models.start_extract_log(execution_key, options)["AcquireKey"]
    _execute_program(extract_destination, options, models.end_extract_log, extract_key,
                     flask.current_app.config["DATALAKE_EXTRACT_TIMEOUT"])


@click.command
@click.option("-f", "--config-file", type=click.File(), help="The configuration file (use - for stdin) containing the "
              "JSON formatted execution details")
def main(config_file):
    data = json.loads(config_file.read())
    execution, acquires, extract = data["execution"], data["acquires"], data["extracted"]
    acquire_program_key = execution.get("acquire_program_key")
    execution_key = models.start_execution_log(execution.get("scheduled_execution_key"), acquire_program_key,
                                               execution.get("client_name"), execution.get("data_set_name"),
                                               execution.get("load_date"), execution.get("ad_hoc_user"))["ExecutionKey"]
    extract_destination = extract["extract_destination"]
    try:
        if acquire_program_key is not None:
            _process_acquires(execution_key, acquire_program_key, acquires)
        if extract_destination is not None:
            _process_extract(execution_key, extract_destination, extract.get("options", []))
    except Exception:
        pass  # Log this to appinsights
    finally:
        models.end_execution_log(execution_key)
