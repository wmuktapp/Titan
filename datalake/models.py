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


def _insert_acquire_program_options(transaction, acquire_program_key, options):
    results = []
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


def start_job_execution(scheduled_execution_key=None, acquire_program_key=None, client_name="", data_set_name="",
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


def update_acquire_program(key, python_name="", friendly_name="", data_source_name="", author="", enabled=False,
                           options=None):
    params = {
        "AcquireProgramKey": key,
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
                                                  {"AcquireProgramKey": key}, {"DeleteRowCount": "INT"})
        option_results = _insert_acquire_program_options(transaction, key, options)
    return update_result, delete_result, option_results
