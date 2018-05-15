import flask_sqlalchemy
import sqlalchemy


_DEFAULT = object()

db = flask_sqlalchemy.SQLAlchemy()


def _execute_stored_procedure(transaction, name, params=None, output_params=None):
    sql_text = "EXEC %s " % name
    sql_text += ", ".join("@%s=:%s" % (param, param) for param in params)
    sql_text += ";"
    if output_params:
        name_types = output_params.items()
        sql_text_prefix = "DECLARE "
        sql_text_prefix += ", ".join("@%s %s" % (name, _type) for name, _type in name_types) + ";"

        sql_text_suffix = ", " + ", ".join("@%s OUT" % name for name, _ in name_types) + ";"
        sql_text_suffix += "SELECT "
        sql_text_suffix += ", ".join("@%s AS %s" % (name, name) for name, _ in name_types)

        sql_text = sql_text_prefix + sql_text + sql_text_suffix
    result = transaction.execute(sqlalchemy.text(sql_text), **params)
    return result


def _insert_acquire_program_options(transaction, acquire_program_key, options=None):
    if not options:
        return None
    results = []
    output_params = {"AcquireProgramOptionKey": "INT"}
    for name, required in options.items():
        params = {
            "AcquireProgramKey": acquire_program_key,
            "AcquireProgramOptionName": name,
            "AcquireProgramOptionRequired": required
        }
        results.append(_execute_stored_procedure(transaction, "config.SP_InsertAcquireProgramOption", params,
                                                 output_params).fetchone())
    return results


def _insert_scheduled_extract_options(transaction, scheduled_extract_key, options=None):
    if not options:
        return None
    results = []
    output_params = {"ScheduledExtractOptionKey": "INT"}
    for name, required in options.items():
        params = {
            "ScheduledExtractKey": scheduled_extract_key,
            "ScheduledExtractOptionName": name,
            "ScheduledExtractOptionValue": required
        }
        results.append(_execute_stored_procedure(transaction, "config.SP_InsertScheduledExtractOption", params,
                                                 output_params).fetchone())
    return results


def delete_scheduled_acquires(transaction, scheduled_execution_key):
    return _execute_stored_procedure(transaction, "config.SP_DeleteScheduledAcquires", scheduled_execution_key,
                                     {"ScheduledAcquireDeleteRowCount": "INT",
                                      "ScheduledAcquireOptionDeleteRowCount": "INT"}).fetchone()


def end_acquire_log(key, error_message=None):
    with db.engine() as transaction:
        result = _execute_stored_procedure(transaction, "log.SP_EndAcquireLog",
                                           {"AcquireKey": key, "AcquireErrorMessage": error_message},
                                           {"UpdateRowCount": "INT"}).fetchone()
    return result


def end_execution_log(key):
    with db.engine() as transaction:
        result = _execute_stored_procedure(transaction, "log.SP_EndExecutionLog", {"ExecutionKey": key},
                                           {"ExecutionLogUpdateRowCount": "INT",
                                            "ScheduledExecutionUpdateRowCount": "INT"}).fetchone()
    return result


def end_extract_log(key, error_message=None):
    with db.engine() as transaction:
        result = _execute_stored_procedure(transaction, "log.SP_EndExtractLog",
                                           {"ExtractKey": key, "ExtractErrorMessage": error_message},
                                           {"UpdateRowCount": "INT"}).fetchone()
    return result


def get_acquire_programs():
    return list(db.engine.execute("SELECT * FROM config.VWAcquirePrograms"))


def get_execution(key):
    return list(db.engine.execute(sqlalchemy.text("SELECT * FROM config.UDF_GetExecution(:key)"), key=key))


def get_executions(page_number=1, page_size=100):
    return list(db.engine.execute(sqlalchemy.text("SELECT * FROM config.UDF_GetExecutions(:page_number, :page_size)"),
                                  page_number=page_number, page_size=page_size))


def get_scheduled_execution(key):
    return list(db.engine.execute(sqlalchemy.text("SELECT * FROM config.UDF_GetSchedule(:key)"), key=key))


def get_scheduled_executions(page_number=1, page_size=100):
    return list(db.engine.execute(sqlalchemy.text("SELECT * FROM config.UDF_GetSchedules(:page_number, :page_size)"),
                                  page_number=page_number, page_size=page_size))


def get_queue(max_items=None):
    params = {}
    if max_items is not None:
        params["MaxItems"] = max_items
    with db.engine() as transaction:
        return list(_execute_stored_procedure(transaction, "dbo.SP_GetQueue", params))


def insert_acquire_program(python_name=None, friendly_name=None, data_source_name=None, author=None, enabled=False,
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
                                           {"AcquireProgramKey": "INT"}).fetchone()
        option_results = _insert_acquire_program_options(transaction, result["AcquireProgramKey"], options)
    return result, option_results


def insert_scheduled_acquire(transaction, scheduled_execution_key, name, options=None):
    option_results = []
    option_output_params = {"ScheduledAcquireOptionKey": "INT"}
    result = _execute_stored_procedure(transaction, "config.SP_InsertScheduledAcquire",
                                       {"ScheduledExecutionKey": scheduled_execution_key,
                                        "ScheduledAcquireName": name},
                                       {"ScheduledAcquireKey": "INT"}).fetchone()
    scheduled_acquire_key = result["ScheduledAcquireKey"]
    for name, value in options.items():
        params = {
            "ScheduledAcquireKey": scheduled_acquire_key,
            "ScheduledAcquireOptionName": name,
            "ScheduledAcquireOptionValue": value
        }
        option_results.append(_execute_stored_procedure(transaction, "config.SP_InsertScheduledAcquireOption",
                                                        params, option_output_params).fetchone())
    return result, option_results


def insert_scheduled_execution(transaction, name="", next_scheduled=None, client_name="", data_set_name="",
                               load_date=None, enabled=False, user="", schedule_end=None, interval_mi=None,
                               interval_hh=None, interval_dd=None, monday_enabled=True, tuesday_enabled=True,
                               wednesday_enabled=True, thursday_enabled=True, friday_enabled=True,
                               saturday_enabled=True, sunday_enabled=True, acquire_program_key=None,
                               extract_destination=None, extract_data_source_name=None, extract_options=None):
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
    result = _execute_stored_procedure(transaction, "config.SP_InsertScheduledExecution", params,
                                       {"ScheduledExecutionKey": "INT", "ScheduledExtractKey": "INT"}).fetchone()
    option_results = _insert_scheduled_extract_options(transaction, result["ScheduledExtractKey"], extract_options)
    return result, option_results


def insert_scheduled_extract(scheduled_execution_key, name, options=None):
    option_results = []
    option_output_params = {"ScheduledExtractOptionKey": "INT"}
    with db.engine() as transaction:
        result = _execute_stored_procedure(transaction, "config.SP_InsertScheduledExtract",
                                           {"ScheduledExecutionKey": scheduled_execution_key,
                                            "ScheduledExtractName": name},
                                           {"ScheduledExtractKey": "INT"}).fetchone()
        if options:
            scheduled_extract_key = result["ScheduledExtractKey"]
            for name, value in options.items():
                params = {
                    "ScheduledExtractKey": scheduled_extract_key,
                    "ScheduledExtractOptionName": name,
                    "ScheduledExtractOptionValue": value
                }
                option_results.append(_execute_stored_procedure(transaction, "config.SP_InsertScheduledExtractOption",
                                                                params, option_output_params).fetchone())
    return result, option_results


def start_acquire_log(execution_key, options=None):
    option_results = []
    option_output_params = {"AcquireOptionKey": "INT"}
    with db.engine() as transaction:
        result = _execute_stored_procedure(transaction, "log.SP_StartAcquireLog", {"ExecutionKey": execution_key},
                                           {"AcquireKey": "INT"}).fetchone()
        if options:
            acquire_key = result["AcquireKey"]
            for name, value in options.items():
                params = {
                    "AcquireKey": acquire_key,
                    "AcquireOptionName": name,
                    "AcquireOptionValue": value
                }
                option_results.append(_execute_stored_procedure(transaction, "log.SP_InsertAcquireOptionLog", params,
                                                                option_output_params).fetchone())
    return result, option_results


def start_execution_log(scheduled_execution_key=None, acquire_program_key=None, client_name=None, data_set_name=None,
                        load_date=None, ad_hoc_user=None):
    params = {
        "ScheduledExecutionKey": scheduled_execution_key,
        "AcquireProgramKey": acquire_program_key,
        "ExecutionClientName": client_name,
        "ExecutionDataSetName": data_set_name,
        "ExecutionLoadDate": load_date,
        "ExecutionAdHocUser": ad_hoc_user
    }
    with db.engine() as transaction:
        result = _execute_stored_procedure(transaction, "log.SP_StartExecutionLog", params,
                                           {"ExecutionKey": "INT"}).fetchone()
    return result


def start_extract_log(execution_key, options=None):
    option_results =[]
    option_output_params = {"ExtractOptionKey": "INT"}
    with db.engine() as transaction:
        result = _execute_stored_procedure(transaction, "log.SP_StartExtractLog", {"ExecutionKey": execution_key},
                                           {"ExtractKey": "INT"}).fetchone()
        if options:
            extract_key = result["ExtractKey"]
            for name, value in options.items():
                params = {
                    "ExtractKey": extract_key,
                    "ExtractOptionName": name,
                    "ExtractOptionValue": value
                }
                option_results.append(_execute_stored_procedure(transaction, "log.SP_InsertAcquireOptionLog", params,
                                                                option_output_params).fetchone())
    return result, option_results


def update_acquire_program(key, python_name=None, friendly_name=None, data_source_name=None, author=None, enabled=False,
                           options=_DEFAULT):
    params = {
        "AcquireProgramKey": key,
        "AcquireProgramPythonName": python_name,
        "AcquireProgramFriendlyName": friendly_name,
        "AcquireProgramDataSourceName": data_source_name,
        "AcquireProgramAuthor": author,
        "AcquireProgramEnabled": enabled
    }
    delete_result = []
    option_results = []
    with db.engine() as transaction:
        update_result = _execute_stored_procedure(transaction, "config.SP_UpdateAcquireProgram", params,
                                                  {"UpdateRowCount": "INT",
                                                   "DisabledScheduledExecutionsCount": "INT"}).fetchone()
        if options is not _DEFAULT:
            delete_result = _execute_stored_procedure(transaction, "config.SP_DeleteAcquireProgramOptions",
                                                      {"AcquireProgramKey": key}, {"DeleteRowCount": "INT"}).fetchone()
            option_results = _insert_acquire_program_options(transaction, key, options)
    return update_result, delete_result, option_results


def update_scheduled_execution(transaction, key, name=None, next_scheduled=None, client_name=None, data_set_name=None,
                               load_date="1900-01-01", enabled=None, user=None, schedule_end=None, interval_mi=-1,
                               interval_hh=-1, interval_dd=-1, monday_enabled=-1, tuesday_enabled=-1,
                               wednesday_enabled=-1, thursday_enabled=-1, friday_enabled=-1,
                               saturday_enabled=-1, sunday_enabled=-1, acquire_program_key=-1,
                               extract_destination="", extract_data_source_name="", extract_options=_DEFAULT):
    params = {
        "ScheduledExecutionKey": key,
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
    output_params = {
        "ScheduledExecutionUpdateRowCount": "INT",
        "ScheduledExtractUpdateRowCount": "INT",
        "ScheduledExtractDeleteRowCount": "INT",
        "ScheduledExtractKey": "INT"
    }
    delete_result = None
    option_results = None
    result = _execute_stored_procedure(transaction, "config.SP_UpdateScheduledExecution", params,
                                       output_params).fetchone()
    if extract_options is not _DEFAULT:
        delete_result = _execute_stored_procedure(transaction, "config.SP_DeleteScheduledExtractOptions",
                                                  {"ScheduledExtractKey": result["ScheduledExtractKey"]},
                                                  {"DeleteRowCount": "INT"}).fetchone()
        option_results = _insert_scheduled_extract_options(transaction, result["ScheduledExtractKey"],
                                                           extract_options)
    return result, delete_result, option_results
