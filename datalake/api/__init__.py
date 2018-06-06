import flask


api_blueprint = flask.Blueprint("api", __name__)


@api_blueprint.before_request
def before_request():
    pass
    # flask.request.headers["Authorization"] = "Bearer %s" % flask.request.headers.get("X-Ms-Token-Aad-Access-Token", "")
