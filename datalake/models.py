import flask_sqlalchemy
import sqlalchemy


db = flask_sqlalchemy.SQLAlchemy()


def _wrap_stored_proc_text(sql_text, params):
    if not params:
        return sql_text
    name_types = params.items()
    wrapped_text = "DECLARE "
    wrapped_text += ", ".join("@%s %s" % (name, _type) for name, _type in name_types) + ";"
    wrapped_text += sql_text.text + ", "
    wrapped_text += ", ".join("@%s OUT" % name for name, _ in name_types) + ";"
    wrapped_text += "SELECT "
    wrapped_text += ", ".join("@%s AS %s" % (name, name) for name, _ in name_types)
    return sqlalchemy.text(wrapped_text)


def _insert_acquire_program_options(transaction, acquire_program_key, options):
    acquire_program_option_keys = []
    for name, required in options.items():
        insert_option_text = _wrap_stored_proc_text(sqlalchemy.text(
            "EXEC config.SP_InsertAcquireProgramOption :acquire_program_key :name :required"
        ), {"AcquireProgramOptionKey": "INT"})
        insert_option_result = transaction.execute(insert_option_text, acquire_program_key=acquire_program_key,
                                                   name=name, required=required)
        acquire_program_option_keys.append(insert_option_result[0]["AcquireProgramOptionKey"])
    return acquire_program_option_keys


def insert_acquire_program(python_name="", friendly_name="", data_source_name="", author="", enabled=False,
                           options=None):
    with db.engine.begin() as transaction:
        insert_text = _wrap_stored_proc_text(sqlalchemy.text(
            "EXEC config.SP_InsertAcquireProgram :python_name, :friendly_name, :data_source_name, :author, :enabled"
        ), {"AcquireProgramKey": "INT"})
        insert_result = transaction.execute(insert_text, python_name=python_name, friendly_name=friendly_name,
                                            data_source_name=data_source_name, author=author, enabled=enabled)
        acquire_program_key = insert_result[0]["AcquireProgramKey"]
        acquire_program_option_keys = _insert_acquire_program_options(transaction, acquire_program_key, options)
    # TO DO: log and return something useful


def update_acquire_program(acquire_program_key, python_name="", friendly_name="", data_source_name="", author="",
                           enabled=False, options=None):
    with db.engine() as transaction:
        update_text = _wrap_stored_proc_text(sqlalchemy.text(
            "EXEC config.SP_UpdateAcquireProgram :acquire_program_key :python_name, :friendly_name, :data_source_name, "
            ":author, :enabled"
        ), {"UpdateRowCount": "INT", "DisabledScheduledExecutionsCount": "INT"})
        update_result = transaction.execute(update_text, acquire_program_key=acquire_program_key,
                                            python_name=python_name, friendly_name=friendly_name,
                                            data_source_name=data_source_name, author=author, enabled=enabled)
        delete_text = _wrap_stored_proc_text(sqlalchemy.text(
            "EXEC config.SP_DeleteAcquireProgramOptions :acquire_program_key",
        {"DeleteRowCount": "INT"}))
        delete_result = transaction.execute(delete_text, acquire_program_key=acquire_program_key)
        acquire_program_option_keys = _insert_acquire_program_options(transaction, acquire_program_key, options)
    # TO DO: log and return something useful