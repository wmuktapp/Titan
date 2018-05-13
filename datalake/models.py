import flask_sqlalchemy
import sqlalchemy


db = flask_sqlalchemy.SQLAlchemy()


def _execute_stored_procedure(transaction, name, params, output_params=None):
    sql_text = "EXEC %s " % name
    sql_text += ", ".join("@%s=:%s" % (param, param) for param in params)
    sql_text += "; "
    if output_params:
        name_types = output_params.items()
        sql_text_prefix = "DECLARE "
        sql_text_prefix += ", ".join("@%s %s" % (name, _type) for name, _type in name_types) + ";"

        sql_text_suffix = ", " + ", ".join("@%s OUT" % name for name, _ in name_types) + ";"
        sql_text_suffix += "SELECT "
        sql_text_suffix += ", ".join("@%s AS %s" % (name, name) for name, _ in name_types)

        sql_text = sql_text_prefix + sql_text + sql_text_suffix
    result = transaction.execute(sqlalchemy.text(sql_text), **params)
    return result[0]


def _insert_acquire_program_options(transaction, acquire_program_key, options=None):
    results = []
    if options:
        output_params = {"AcquireProgramOptionKey": "INT"}
        for name, required in options.items():
            params = {
                "AcquireProgramKey": acquire_program_key,
                "AcquireProgramOptionName": name,
                "AcquireProgramOptionRequired": required
            }
            results.append(_execute_stored_procedure(transaction, "config.SP_InsertAcquireProgramOption", params,
                                                     output_params))
    return results


def end_acquire_log(acquire_key, acquire_error_message=None):
    with db.engine() as transaction:
        result = _execute_stored_procedure(transaction, "log.SP_EndAcquireLog",
                                           {"AcquireKey": acquire_key, "AcquireErrorMessage": acquire_error_message},
                                           {"UpdateRowCount": "INT"})
    return result


def end_execution_log(execution_key):
    with db.engine() as transaction:
        result = _execute_stored_procedure(transaction, "log.SP_EndExecutionLog", {"ExecutionKey": execution_key},
                                           {"ExecutionLogUpdateRowCount": "INT",
                                            "ScheduledExecutionUpdateRowCount": "INT"})
    return result


def end_extract_log(extract_key, extract_error_message=None):
    with db.engine() as transaction:
        result = _execute_stored_procedure(transaction, "log.SP_EndExtractLog",
                                           {"ExtractKey": extract_key, "ExtractErrorMessage": extract_error_message},
                                           {"UpdateRowCount": "INT"})
    return result


def insert_acquire_program(python_name="", friendly_name="", data_source_name="", author="", enabled=False,
                           options=None):
    params = {
        "AcquireProgramPythonName": python_name,
        "AcquireProgramFriendlyName": friendly_name,
        "AcquireProgramDataSourceName": data_source_name,
        "AcquireProgramAuthor": author,
        "AcquireProgramEnabled": enabled
    }
    with db.engine.begin() as transaction:
        result = _execute_stored_procedure(transaction, "config.SP_InsertAcquireProgram", params,
                                           {"AcquireProgramKey": "INT"})
        option_results = _insert_acquire_program_options(transaction, result["AcquireProgramKey"], options)
    return result, option_results


def insert_scheduled_execution(name="", next_scheduled=None, client_name="", data_set_name="", load_date=None,
                               enabled=False, user="", schedule_end=None, interval_mi=None, interval_hh=None,
                               interval_dd=None, monday_enabled=True, tuesday_enabled=True, wednesday_enabled=True,
                               thursday_enabled=True, friday_enabled=True, saturday_enabled=True, sunday_enabled=True,
                               acquire_program_key=None, extract_destination="", extract_data_source_name=""):
    params = {
        "ScheduledExecutionName": name,
        "ScheduledExecutionNextScheduled": next_scheduled,
        "ScheduledExecutionClientName": client_name,
        "ScheduledExecutionDataSetName": data_set_name,
        "ScheduledExecutionLoadDate": load_date,
        "ScheduledExecutionEnabled": enabled,
        "ScheduledExecutionUser": user,
        "ScheduledExecutionScheduleEnd": schedule_end,
        "ScheduledIntervalMI": interval_mi,
        "ScheduledIntervalHH": interval_hh,
        "ScheduledIntervalDD": interval_dd,
        "ScheduledIntervalMondayEnabled": monday_enabled,
        "ScheduledIntervalTuesdayEnabled": tuesday_enabled,
        "ScheduledIntervalWednesdayEnabled": wednesday_enabled,
        "ScheduledIntervalThursdayEnabled": thursday_enabled,
        "ScheduledIntervalFridayEnabled": friday_enabled,
        "ScheduledIntervalSaturdayEnabled": saturday_enabled,
        "ScheduledIntervalSundayEnabled": sunday_enabled,
        "AcquireProgramKey": acquire_program_key,
        "ScheduledExtractDestination": extract_destination,
        "ScheduledExtractDataSourceName": extract_data_source_name
    }
    with db.engine() as transaction:
        result = _execute_stored_procedure(transaction, "config.SP_InsertScheduledExecution", params,
                                           {"ScheduledExecutionKey": "INT", "ScheduledExtractKey": "INT"})
    return result


def insert_scheduled_acquire(scheduled_execution_key, name, options=None):
    option_results = []
    output_params = {"ScheduledAcquireOptionKey": "INT"}
    with db.engine() as transaction:
        result = _execute_stored_procedure(transaction, "config.SP_InsertScheduledAcquire",
                                           {"ScheduledExecutionKey": scheduled_execution_key,
                                            "ScheduledAcquireName": name},
                                           {"ScheduledAcquireKey": "INT"})
        scheduled_acquire_key = result["ScheduledAcquireKey"]
        for name, value in options.items():
            params = {
                "ScheduledAcquireKey": scheduled_acquire_key,
                "ScheduledAcquireOptionName": name,
                "ScheduledAcquireOptionValue": value
            }
            option_results.append(_execute_stored_procedure(transaction, "config.SP_InsertScheduledAcquireOption",
                                                            params, output_params))
    return result, option_results


def insert_scheduled_extract(scheduled_execution_key, name, options=None):
    option_results = []
    output_params = {"ScheduledExtractOptionKey": "INT"}
    with db.engine() as transaction:
        result = _execute_stored_procedure(transaction, "config.SP_InsertScheduledExtract",
                                           {"ScheduledExecutionKey": scheduled_execution_key,
                                            "ScheduledExtractName": name},
                                           {"ScheduledExtractKey": "INT"})
        scheduled_extract_key = result["ScheduledExtractKey"]
        if options:
            for name, value in options.items():
                params = {
                    "ScheduledExtractKey": scheduled_extract_key,
                    "ScheduledExtractOptionName": name,
                    "ScheduledExtractOptionValue": value
                }
                option_results.append(_execute_stored_procedure(transaction, "config.SP_InsertScheduledExtractOption",
                                                                params, output_params))
    return result, option_results


def start_acquire_log(execution_key, options=None):
    option_results = []
    output_params = {"AcquireOptionKey": "INT"}
    with db.engine() as transaction:
        result = _execute_stored_procedure(transaction, "log.SP_StartAcquireLog", {"ExecutionKey": execution_key},
                                           {"AcquireKey": "INT"})
        acquire_key = result["AcquireKey"]
        if options:
            for name, value in options.items():
                params = {
                    "AcquireKey": acquire_key,
                    "AcquireOptionName": name,
                    "AcquireOptionValue": value
                }
                option_results.append(_execute_stored_procedure(transaction, "log.SP_InsertAcquireOptionLog", params,
                                                                output_params))
    return result, option_results


def start_execution_log(scheduled_execution_key=None, acquire_program_key=None, client_name="", data_set_name="",
                        load_date=None, ad_hoc_user=""):
    params = {
        "ScheduledExecutionKey": scheduled_execution_key,
        "AcquireProgramKey": acquire_program_key,
        "ExecutionClientName": client_name,
        "ExecutionDataSetName": data_set_name,
        "ExecutionLoadDate": load_date,
        "ExecutionAdHocUser": ad_hoc_user
    }
    with db.engine() as transaction:
        result = _execute_stored_procedure(transaction, "log.SP_StartExecutionLog", params, {"ExecutionKey": "INT"})
    return result


def start_extract_log(execution_key, options=None):
    option_results =[]
    output_params = {"ExtractOptionKey": "INT"}
    with db.engine() as transaction:
        result = _execute_stored_procedure(transaction, "log.SP_StartExtractLog", {"ExecutionKey": execution_key},
                                           {"ExtractKey": "INT"})
        extract_key = result["ExtractKey"]
        if options:
            for name, value in options.items():
                params = {
                    "ExtractKey": extract_key,
                    "ExtractOptionName": name,
                    "ExtractOptionValue": value
                }
                option_results.append(_execute_stored_procedure(transaction, "log.SP_InsertAcquireOptionLog", params,
                                                                output_params))
    return result, option_results


def update_acquire_program(acquire_program_key, python_name="", friendly_name="", data_source_name="", author="",
                           enabled=False, options=None):
    params = {
        "AcquireProgramKey": acquire_program_key,
        "AcquireProgramPythonName": python_name,
        "AcquireProgramFriendlyName": friendly_name,
        "AcquireProgramDataSourceName": data_source_name,
        "AcquireProgramAuthor": author,
        "AcquireProgramEnabled": enabled
    }
    with db.engine() as transaction:
        update_result = _execute_stored_procedure(transaction, "config.SP_UpdateAcquireProgram", params,
                                                  {"UpdateRowCount": "INT", "DisabledScheduledExecutionsCount": "INT"})
        delete_result = _execute_stored_procedure(transaction, "config.SP_DeleteAcquireProgram",
                                                  {"AcquireProgramKey": acquire_program_key}, {"DeleteRowCount": "INT"})
        option_results = _insert_acquire_program_options(transaction, acquire_program_key, options)
    return update_result, delete_result, option_results


def update_scheduled_execution(scheduled_execution_key, name="", next_scheduled=None, client_name="", data_set_name="",
                               load_date=None, enabled=False, user="", schedule_end=None, interval_mi=None,
                               interval_hh=None, interval_dd=None, monday_enabled=True, tuesday_enabled=True,
                               wednesday_enabled=True, thursday_enabled=True, friday_enabled=True,
                               saturday_enabled=True, sunday_enabled=True, acquire_program_key=None,
                               extract_destination="", extract_data_source_name=""):
    params = {
        "ScheduledExecutionKey": scheduled_execution_key,
        "ScheduledExecutionName": name,
        "ScheduledExecutionNextScheduled": next_scheduled,
        "ScheduledExecutionClientName": client_name,
        "ScheduledExecutionDataSetName": data_set_name,
        "ScheduledExecutionLoadDate": load_date,
        "ScheduledExecutionEnabled": enabled,
        "ScheduledExecutionUser": user,
        "ScheduledExecutionScheduleEnd": schedule_end,
        "ScheduledIntervalMI": interval_mi,
        "ScheduledIntervalHH": interval_hh,
        "ScheduledIntervalDD": interval_dd,
        "ScheduledIntervalMondayEnabled": monday_enabled,
        "ScheduledIntervalTuesdayEnabled": tuesday_enabled,
        "ScheduledIntervalWednesdayEnabled": wednesday_enabled,
        "ScheduledIntervalThursdayEnabled": thursday_enabled,
        "ScheduledIntervalFridayEnabled": friday_enabled,
        "ScheduledIntervalSaturdayEnabled": saturday_enabled,
        "ScheduledIntervalSundayEnabled": sunday_enabled,
        "AcquireProgramKey": acquire_program_key,
        "ScheduledExtractDestination": extract_destination,
        "ScheduledExtractDataSourceName": extract_data_source_name
    }
    with db.engine() as transaction:
        result = _execute_stored_procedure(transaction, "config.SP_UpdateScheduledExecution", params,
                                           {"ScheduledExecutionUpdateRowCount": "INT",
                                            "ScheduledExtractUpdateRowCount": "INT",
                                            "ScheduledExtractDeleteRowCount": "INT",
                                            "ScheduledExtractKey": "INT"})
    return result