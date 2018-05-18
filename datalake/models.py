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
    for option_params in options:
        option_params["AcquireProgramKey"] = acquire_program_key
        results.append(_execute_stored_procedure(transaction, "config.SP_InsertAcquireProgramOption", option_params,
                                                 output_params).fetchone())
    return results


def _insert_scheduled_extract_options(transaction, scheduled_extract_key, options=None):
    if not options:
        return None
    results = []
    output_params = {"ScheduledExtractOptionKey": "INT"}
    for option_params in options:
        option_params["ScheduledExtractKey"] = scheduled_extract_key
        results.append(_execute_stored_procedure(transaction, "config.SP_InsertScheduledExtractOption", option_params,
                                                 output_params).fetchone())
    return results


def delete_scheduled_acquires(transaction, params):
    output_params = {"ScheduledAcquireDeleteRowCount": "INT",  "ScheduledAcquireOptionDeleteRowCount": "INT"}
    return _execute_stored_procedure(transaction, "config.SP_DeleteScheduledAcquires", scheduled_execution_key,
                                     output_params).fetchone()


def end_acquire_log(key, error_message=None):
    params = {"AcquireKey": key, "AcquireErrorMessage": error_message}
    output_params = {"UpdateRowCount": "INT"}
    with db.engine.begin() as transaction:
        result = _execute_stored_procedure(transaction, "log.SP_EndAcquireLog", params, output_params).fetchone()
    return result


def end_execution_log(key, error_message=None):
    with db.engine.begin() as transaction:
        result = _execute_stored_procedure(transaction, "log.SP_EndExecutionLog",
                                           {"ExecutionKey": key, "ExecutionErrorMessage": error_message},
                                           {"ExecutionLogUpdateRowCount": "INT",
                                            "ScheduledExecutionUpdateRowCount": "INT"}).fetchone()
    return result


def end_extract_log(key, error_message=None):
    with db.engine.begin() as transaction:
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
    return list(db.engine.execute(sqlalchemy.text("SELECT * FROM config.UDF_GetScheduledExecution(:key)"), key=key))


def get_scheduled_executions(page_number=1, page_size=100):
    return list(db.engine.execute(sqlalchemy.text("SELECT * FROM config.UDF_GetScheduledExecutions(:page_number, "
                                                  ":page_size)"), page_number=page_number, page_size=page_size))


def get_queue(max_items=None):
    params = {} if max_items is None else {"MaxItems": max_items}
    with db.engine.begin() as transaction:
        return list(_execute_stored_procedure(transaction, "dbo.SP_GetQueue", params))


def insert_acquire_program(python_name, friendly_name, data_source_name, author, enabled, options=None):
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


def insert_scheduled_execution(transaction, params, extract_options):
    result = _execute_stored_procedure(transaction, "config.SP_InsertScheduledExecution", params,
                                       {"ScheduledExecutionKey": "INT", "ScheduledExtractKey": "INT"}).fetchone()
    option_results = _insert_scheduled_extract_options(transaction, result["ScheduledExtractKey"], extract_options)
    return result, option_results


def start_acquire_log(execution_key, options=None):
    option_results = []
    option_output_params = {"AcquireOptionKey": "INT"}
    with db.engine.begin() as transaction:
        result = _execute_stored_procedure(transaction, "log.SP_StartAcquireLog", {"ExecutionKey": execution_key},
                                           {"AcquireKey": "INT"}).fetchone()
        if options:
            acquire_key = result["AcquireKey"]
            for name, value in options.items():
                option_params = {
                    "AcquireKey": acquire_key,
                    "AcquireOptionName": name,
                    "AcquireOptionValue": value
                }
                option_results.append(_execute_stored_procedure(transaction, "log.SP_InsertAcquireOptionLog",
                                                                option_params, option_output_params).fetchone())
    return result, option_results


def start_execution_log(scheduled_execution_key=None, acquire_program_key=None, client_name=None, data_source_name=None,
                        data_set_name=None, load_date=None, ad_hoc_user=None):
    params = {
        "ScheduledExecutionKey": scheduled_execution_key,
        "AcquireProgramKey": acquire_program_key,
        "ExecutionClientName": client_name,
        "ExecutionDataSourceName": data_source_name,
        "ExecutionDataSetName": data_set_name,
        "ExecutionLoadDate": load_date,
        "ExecutionAdHocUser": ad_hoc_user
    }
    with db.engine.begin() as transaction:
        result = _execute_stored_procedure(transaction, "log.SP_StartExecutionLog", params,
                                           {"ExecutionKey": "INT"}).fetchone()
    return result


def start_extract_log(execution_key, destination=None, options=None):
    option_results = []
    option_output_params = {"ExtractOptionKey": "INT"}
    with db.engine.begin() as transaction:
        result = _execute_stored_procedure(transaction, "log.SP_StartExtractLog",
                                           {"ExecutionKey": execution_key, "ExtractDestination": destination},
                                           {"ExtractKey": "INT"}).fetchone()
        if options:
            extract_key = result["ExtractKey"]
            for name, value in options.items():
                option_params = {
                    "ExtractKey": extract_key,
                    "ExtractOptionName": name,
                    "ExtractOptionValue": value
                }
                option_results.append(_execute_stored_procedure(transaction, "log.SP_InsertExtractOptionLog",
                                                                option_params, option_output_params).fetchone())
    return result, option_results


def update_acquire_program(acquire_program):
    delete_result = None
    option_results = None
    update_output_params = {"UpdateRowCount": "INT", "DisabledScheduledExecutionsCount": "INT"}
    options = acquire_program.get("Options", _DEFAULT)
    with db.engine.begin() as transaction:
        update_result = _execute_stored_procedure(transaction, "config.SP_UpdateAcquireProgram", acquire_program,
                                                  update_output_params).fetchone()
        if options is not _DEFAULT:
            key_param = {"AcquireProgramKey": acquire_program.get("AcquireProgramKey")}
            delete_output_params = {"DeleteRowCount": "INT"}
            delete_result = _execute_stored_procedure(transaction, "config.SP_DeleteAcquireProgramOptions", key_param,
                                                      delete_output_params).fetchone()
            option_results = _insert_acquire_program_options(transaction, key_param, options)
    return update_result, delete_result, option_results


def update_scheduled_execution(transaction, execution, extract):
    delete_result = None
    option_results = None
    update_output_params = {
        "ScheduledExecutionUpdateRowCount": "INT",
        "ScheduledExtractUpdateRowCount": "INT",
        "ScheduledExtractDeleteRowCount": "INT",
        "ScheduledExtractKey": "INT"
    }
    options = extract.pop("Options", _DEFAULT)
    execution.update(extract)
    result = _execute_stored_procedure(transaction, "config.SP_UpdateScheduledExecution", execution,
                                       update_output_params).fetchone()
    if options is not _DEFAULT:
        key_param = {"ScheduledExtractKey": result["ScheduledExtractKey"]}
        delete_output_params = {"DeleteRowCount": "INT"}
        delete_result = _execute_stored_procedure(transaction, "config.SP_DeleteScheduledExtractOptions",
                                                  key_param, delete_output_params).fetchone()
        option_results = _insert_scheduled_extract_options(transaction, key_param, options)
    return result, delete_result, option_results
