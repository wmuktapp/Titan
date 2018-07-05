import collections
import importlib
import json

from sqlalchemy import exc
import flask

from titan import api, app, models
from titan.api import decorators


def _nested_default_dict():
    # This allows an arbitrary amount of nested default dicts
    return collections.defaultdict(_nested_default_dict)


@api.api_blueprint.route("/executions/", methods=["POST"])
@decorators.to_json
def execute():
    data = flask.request.get_json(force=True).get("data", {"execution": {}, "acquires": [], "extract": {}})
    execution = data.get("execution", {})
    if execution.get("AcquireProgramKey") == 0:
        del execution["AcquireProgramKey"]
    acquires = data.get("acquires", [])
    for acquire in acquires:
        acquire["Options"] = [option for option in acquire["Options"] if option["AcquireOptionValue"] != ""]
    extract = data.get("extract", {})
    if extract.get("ExtractDestination") is None:
        extract.clear()
    else:
        extract["Options"] = [option for option in extract["Options"] if option["ExtractOptionValue"] != ""]
    if not acquires and not extract:
        return {"error": {"message": "Neither an acquire or an extract were provided."}}, 400, None
    try:
        execution_key = app.execute(data)
    except Exception as error:
        return {"error": {"message": str(error)}}, 400, None
    return {}, 201, {"Location": flask.url_for("monitoring_execution", execution_key=execution_key)}


@api.api_blueprint.route("/acquire-programs/", methods=["GET"])
@decorators.to_json
def get_acquire_programs():
    acquire_programs = {}
    for row in models.get_acquire_programs():
        key = row["AcquireProgramKey"]
        acquire_program = acquire_programs.get(key)
        if acquire_program is None:
            acquire_program = acquire_programs[key] = {
                "AcquireProgramKey": key,
                "AcquireProgramPythonName": row["AcquireProgramPythonName"],
                "AcquireProgramFriendlyName": row["AcquireProgramFriendlyName"],
                "AcquireProgramDataSourceName": row["AcquireProgramDataSourceName"],
                "AcquireProgramEnabled": row["AcquireProgramEnabled"],
                "AcquireProgramHelp": row["AcquireProgramHelp"],
                "Options": []
            }
        option_name = row["AcquireProgramOptionName"]
        if option_name is not None:
            acquire_program["Options"].append({
                "AcquireProgramOptionName": option_name,
                "AcquireProgramOptionRequired": row["AcquireProgramOptionRequired"],
                "AcquireProgramOptionType": row["AcquireProgramOptionType"],
                "AcquireProgramOptionHelp": row["AcquireProgramOptionHelp"]
            })
    return {"data": acquire_programs.values()}


@api.api_blueprint.route("/executions/<int:key>", methods=["GET"])
@decorators.to_json
def get_execution(key):
    rows = models.get_execution(key)
    if not rows:
        flask.abort(404)
    arbitrary_row = rows[0]
    client_name = arbitrary_row["ExecutionClientName"]
    data_source_name = arbitrary_row["ExecutionDataSourceName"]
    data_set_name = arbitrary_row["ExecutionDataSetName"]
    load_date = arbitrary_row["ExecutionLoadDate"]
    current_version = arbitrary_row["ExecutionVersion"]
    extract_key = arbitrary_row["ExtractKey"]
    extract_options = []
    data = {
        "execution": {
            "ExecutionKey": arbitrary_row["ExecutionKey"],
            "ExecutionContainerGroupName": arbitrary_row["ExecutionContainerGroupName"],
            "ScheduledExecutionKey": arbitrary_row["ScheduledExecutionKey"],
            "ExecutionScheduledTime": arbitrary_row["ExecutionScheduledTime"],
            "ExecutionStartTime": arbitrary_row["ExecutionStartTime"],
            "ExecutionEndTime": arbitrary_row["ExecutionEndTime"],
            "ExecutionStatus": arbitrary_row["ExecutionStatus"],
            "ExecutionErrorMessage": arbitrary_row["ExecutionErrorMessage"],
            "ExecutionClientName": client_name,
            "ExecutionDataSourceName": data_source_name,
            "ExecutionDataSetName": data_set_name,
            "ExecutionLoadDate": load_date,
            "ExecutionVersion": current_version,
            "ExecutionUser": arbitrary_row["ExecutionUser"],
            "AcquireProgramKey": arbitrary_row["AcquireProgramKey"],
            "AcquireProgramFriendlyName": arbitrary_row["AcquireProgramFriendlyName"]
        },
        "acquires": [],
        "extract": {
            "ExtractKey": extract_key,
            "ExtractDestination": arbitrary_row["ExtractDestination"],
            "ExtractStartTime": arbitrary_row["ExtractStartTime"],
            "ExtractEndTime": arbitrary_row["ExtractEndTime"],
            "ExtractStatus": arbitrary_row["ExtractStatus"],
            "ExtractErrorMessage": arbitrary_row["ExtractErrorMessage"],
            "Options": extract_options
        } if extract_key is not None else {}
    }
    acquires = {}
    for row in rows:
        acquire_key = row["AcquireKey"]
        if acquire_key is not None:
            acquire = acquires.get(acquire_key)
            if acquire is None:
                acquire = acquires[acquire_key] = {
                    "AcquireKey": row["AcquireKey"],
                    "AcquireStartTime": row["AcquireStartTime"],
                    "AcquireEndTime": row["AcquireEndTime"],
                    "AcquireStatus": row["AcquireStatus"],
                    "AcquireErrorMessage": row["AcquireErrorMessage"],
                    "Options": []
                }
            acquire_options = acquire["Options"]
            acquire_option_name = row["AcquireOptionName"]
            if acquire_option_name is not None:
                option = {
                    "AcquireOptionName": acquire_option_name,
                    "AcquireOptionValue": row["AcquireOptionValue"]
                }
                if option not in acquire_options:
                    acquire_options.append(option)
        extract_option_name = row["ExtractOptionName"]
        if extract_option_name is not None:
            option = {
                "ExtractOptionName": extract_option_name,
                "ExtractOptionValue": row["ExtractOptionValue"]
            }
            if option not in extract_options:
                extract_options.append(option)
    data["acquires"].extend(acquires.values())
    versions = {
        row["ExecutionVersion"]: row["ExecutionKey"]
        for row in models.get_versions(client_name, data_source_name, data_set_name, load_date.strftime("%Y-%m-%d"))
    }
    del versions[current_version]
    return {"data": data, "other_versions": versions}


@api.api_blueprint.route("/executions/", methods=["GET"])
@decorators.to_json
def get_executions():
    params = {}
    for k in ("end_date", "page_number", "page_size", "load_date_count"):
        value = flask.request.args.get(k)
        if value is not None:
            params[k] = value
    data = _nested_default_dict()
    for row in models.get_executions(**params):
        details = dict(row)
        data[details.pop("ExecutionClientName")][details.pop("ExecutionDataSourceName")][
            details.pop("ExecutionDataSetName")][details.pop("ExecutionLoadDate").strftime("%Y-%m-%d")] = details
    return {"data": dict(data)}


@api.api_blueprint.route("/extract-programs/", methods=["GET"])
@decorators.to_json
def get_extract_programs():
    data = []
    for python_name, friendly_name in (("azuresql", "Azure SQL"), ):
        program = importlib.import_module("titan.extract.%s" % python_name)
        data.append({
            "ExtractProgramPythonName": python_name,
            "ExtractProgramFriendlyName": friendly_name,
            "ExtractProgramHelp": program.main.help,
            "Options": [
                {
                    "ExtractProgramOptionName": max(option.opts, key=len),
                    "ExtractProgramOptionRequired": option.required,
                    "ExtractProgramOptionType": option.type.name,
                    "ExtractProgramOptionHelp": option.help
                }
                for option in program.main.params
            ]
        })
    return {"data": data}


@api.api_blueprint.route("/schedules/<int:key>", methods=["GET"])
@decorators.to_json
def get_scheduled_execution(key):
    rows = models.get_scheduled_execution(key)
    if not rows:
        flask.abort(404)
    arbitrary_row = rows[0]
    scheduled_extract_destination = arbitrary_row["ScheduledExtractDestination"]
    extract_options = []
    data = {
        "execution": {
            "ScheduledExecutionKey": arbitrary_row["ScheduledExecutionKey"],
            "ScheduledExecutionName": arbitrary_row["ScheduledExecutionName"],
            "ScheduledExecutionNextScheduled": arbitrary_row["ScheduledExecutionNextScheduled"],
            "ScheduledExecutionScheduleEnd": arbitrary_row["ScheduledExecutionScheduleEnd"],
            "ScheduledExecutionClientName": arbitrary_row["ScheduledExecutionClientName"],
            "ScheduledExecutionDataSourceName": arbitrary_row["ScheduledExecutionDataSourceName"],
            "ScheduledExecutionDataSetName": arbitrary_row["ScheduledExecutionDataSetName"],
            "ScheduledExecutionNextLoadDate": arbitrary_row["ScheduledExecutionNextLoadDate"],
            "ScheduledExecutionEnabled": arbitrary_row["ScheduledExecutionEnabled"],
            "ScheduledExecutionUser": arbitrary_row["ScheduledExecutionUser"],
            "ScheduledIntervalMI": arbitrary_row["ScheduledIntervalMI"],
            "ScheduledIntervalHH": arbitrary_row["ScheduledIntervalHH"],
            "ScheduledIntervalDD": arbitrary_row["ScheduledIntervalDD"],
            "ScheduledMondayEnabled": arbitrary_row["ScheduledMondayEnabled"],
            "ScheduledTuesdayEnabled": arbitrary_row["ScheduledTuesdayEnabled"],
            "ScheduledWednesdayEnabled": arbitrary_row["ScheduledWednesdayEnabled"],
            "ScheduledThursdayEnabled": arbitrary_row["ScheduledThursdayEnabled"],
            "ScheduledFridayEnabled": arbitrary_row["ScheduledFridayEnabled"],
            "ScheduledSaturdayEnabled": arbitrary_row["ScheduledSaturdayEnabled"],
            "ScheduledSundayEnabled": arbitrary_row["ScheduledSundayEnabled"],
            "AcquireProgramKey": arbitrary_row["AcquireProgramKey"],
        },
        "acquires": [],
        "extract": {
            "ScheduledExtractDestination": scheduled_extract_destination,
            "Options": extract_options
        } if scheduled_extract_destination is not None else {}
    }
    acquires = {}
    for row in rows:
        scheduled_acquire_name = row["ScheduledAcquireName"]
        if scheduled_acquire_name is not None:
            acquire = acquires.get(scheduled_acquire_name)
            if acquire is None:
                acquire = acquires[scheduled_acquire_name] = {
                    "ScheduledAcquireName": scheduled_acquire_name,
                    "Options": []
                }
            acquire_options = acquire["Options"]
            acquire_option_name = row["ScheduledAcquireOptionName"]
            if acquire_option_name is not None:
                option = {
                    "ScheduledAcquireOptionName": acquire_option_name,
                    "ScheduledAcquireOptionValue": row["ScheduledAcquireOptionValue"]
                }
                if option not in acquire_options:
                    acquire_options.append(option)
        extract_option_name = row["ScheduledExtractOptionName"]
        if extract_option_name is not None:
            option = {
                "ScheduledExtractOptionName": extract_option_name,
                "ScheduledExtractOptionValue": row["ScheduledExtractOptionValue"]
            }
            if option not in extract_options:
                extract_options.append(option)
    data["acquires"].extend(acquires.values())
    return {"data": data}


@api.api_blueprint.route("/schedules/", methods=["GET"])
@decorators.to_json
def get_scheduled_executions():
    params = {}
    for k in ("page_number", "page_size"):
        value = flask.request.args.get(k)
        if value is not None:
            params[k] = value
    return {"data": [dict(row) for row in models.get_scheduled_executions(**params)]}


@api.api_blueprint.route("/schedules/", methods=["POST"])
@decorators.to_json
def insert_scheduled_execution():
    data = flask.request.get_json(force=True).get("data", {})
    execution = data.get("execution", {})
    acquires = data.get("acquires", [])
    if execution.get("AcquireProgramKey") == 0:
        del execution["AcquireProgramKey"]
    for acquire in acquires:
        acquire["Options"] = [option for option in acquire["Options"] if option["ScheduledAcquireOptionValue"] != ""]
    extract = data.get("extract", {})
    if extract.get("ScheduledExtractDestination") == "":
        del execution["extract"]
    else:
        extract["Options"] = [option for option in extract["Options"] if option["ExtractOptionValue"] != ""]
    try:
        with models.db.engine.begin() as transaction:
            result = models.insert_scheduled_execution(transaction, execution, extract)[0]
            scheduled_execution_key = result["ScheduledExecutionKey"]
            for acquire in acquires:
                acquire["ScheduledExecutionKey"] = scheduled_execution_key
                models.insert_scheduled_acquire(transaction, acquire)
    except exc.SQLAlchemyError as error:
        return {"error": {"code": error.code, "message": str(error)}}, 400, None
    return {}, 201, None


@api.api_blueprint.route("/executions/retry", methods=["POST"])
@decorators.to_json
def retry_executions():
    invalid_keys = []
    valid_execution_details = []
    for key in flask.request.get_json(force=True)["data"]:
        execution_json = models.get_execution_json(key)["ExecutionJSON"]
        valid_execution_details.append(execution_json) if execution_json else invalid_keys.append(key)
    if invalid_keys:
        return {"error": {"message": "the following keys are invalid as no execution details could be located: %s" %
                invalid_keys}}, 400, None
    for execution_json in valid_execution_details:
        app.execute(json.loads(execution_json))
    return {}, 201, None


@api.api_blueprint.route("/schedules/<int:key>", methods=["PUT"])
@decorators.to_json
def update_scheduled_execution(key):
    data = flask.request.get_json(force=True).get("data", {})
    params = {"ScheduledExecutionKey": key}
    execution = data.get("execution", {})
    execution.update(params)
    acquires = data.get("acquires", [])
    if execution.get("AcquireProgramKey") == 0:
        del execution["AcquireProgramKey"]
    for acquire in acquires:
        acquire["Options"] = [option for option in acquire["Options"] if option["ScheduledAcquireOptionValue"] != ""]
    extract = data.get("extract", {})
    if extract.get("ScheduledExtractDestination") == "":
        del execution["extract"]
    else:
        extract["Options"] = [option for option in extract["Options"] if option["ExtractOptionValue"] != ""]
    try:
        with models.db.engine.begin() as transaction:
            models.update_scheduled_execution(transaction, execution, extract)
            models.delete_scheduled_acquires(transaction, params)
            for acquire in acquires:
                acquire.update(params)
                models.insert_scheduled_acquire(transaction, acquire)
    except exc.SQLAlchemyError as error:
        return {"error": {"code": error.code, "message": str(error)}}, 400, None
    return {}, 201, None
