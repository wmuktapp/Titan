import flask

from datalake import api, models


@api.api_blueprint.route("/schedules/", methods=["POST"])
def create_scheduled_execution():
    data = flask.request.get_json(force=True)
    execution = data["execution"]
    acquires = data["acquires"]
    extract = data["extract"]
    params = {key: execution[key] for key in ("name", "next_scheduled", "client_name", "data_set_name", "load_date",
                                              "enabled", "user", "schedule_end", "interval_mi", "interval_hh",
                                              "interval_dd", "monday_enabled", "tuesday_enabled", "wednesday_enabled",
                                              "thursday_enabled", "friday_enabled", "saturday_enabled",
                                              "sunday_enabled", "acquire_program_key")}
    for key in ("extract_destination", "extract_data_source_name", "extract_options"):
        params[key] = extract[key]
    with models.db.engine() as transaction:
        result, _ = models.insert_scheduled_execution(transaction, **params)
        scheduled_execution_key = result["ScheduledExecutionKey"]
        for acquire in acquires:
            models.insert_scheduled_acquire(transaction, scheduled_execution_key, acquire["name"], acquire["options"])


@api.api_blueprint.route("/execute", methods=["POST"])
def execute():
    pass


@api.api_blueprint.route("/executions/", methods=["GET"])
def get_executions():
    result = models.get_executions(flask.request.args.get("page_number", 1), flask.request.args.get("page_size", 100))


@api.api_blueprint.route("/extension/<int:key>", methods=["GET"])
def get_execution(key):
    pass


@api.api_blueprint.route("/schedules/", methods=["GET"])
def get_scheduled_executions():
    pass


@api.api_blueprint.route("/schedules/<int:key>", metods=["GET"])
def get_scheduled_execution(key):
    pass


@api.api_blueprint.route("/acquire-programs/", methods=["GET"])
def get_acquire_programs():
    pass


@api.api_blueprint.route("/extract-programs/", methods=["GET"])
def get_extract_programs():
    pass


@api.api_blueprint.route("/executions/retry", methods=["POST"])
def retry_executions():
    pass


@api.api_blueprint.route("/schedules/<int:key>", methods=["PUT"])
def update_scheduled_execution(key):
    pass
