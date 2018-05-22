import os

from applicationinsights.flask import ext
import dotenv
import flask

from datalake import api, app, config, models
from datalake.utilities import *


def create_app(source):
    flask_app = flask.Flask("datalake", instance_relative_config=True)
    flask_app.logger.info("App object created from %s" % source)

    dotenv.load_dotenv(os.path.join(os.path.dirname(__file__), "config.env"))
    environment = os.environ.get("DATALAKE_CONFIG_ENVIRONMENT")
    flask_app.config.from_object(config.CONFIGURATIONS[environment])
    flask_app.config.from_pyfile("%s.py" % environment, silent=True)
    flask_app.config.from_envvar("DATALAKE_CONFIG_OVERRIDE_PATH", silent=True)
    flask_app.logger.debug("Configuration loaded using environment: %s" % environment)

    flask_app.register_blueprint(api.api_blueprint, url_prefix="/api")

    models.db.init_app(flask_app)
    ext.AppInsights().init_app(flask_app)
    flask_app.logger.debug("Enabling Azure Application Insights log stream from app")

    flask_app.config["DATALAKE_AZURE_SECURITY_CONTEXT"] = app.AzureSecurityContext(
        flask_app.config["DATALAKE_AZURE_SUBSCRIPTION_ID"],
        flask_app.config["DATALAKE_AZURE_APPLICATION_ID"],
        flask_app.config["DATALAKE_AZURE_APPLICATION_KEY"],
        flask_app.config["DATALAKE_AZURE_TENANT_ID"]
    )
    return flask_app


# TODO: Implement error pages (add as views to views.py)