import os

import dotenv
import flask

from datalake import api, config, models


def create_app():
    app = flask.Flask(__name__, instance_relative_config=True)

    dotenv.load_dotenv(os.path.join(os.path.dirname(__file__), "config.env"))
    environment = os.environ.get("DATALAKE_CONFIG_ENVIRONMENT")
    if environment is not None:
        app.config.from_object(config.CONFIGURATIONS[environment])
    app.config.from_pyfile("%s.py" % environment, silent=True)
    app.config.from_envvar("DATALAKE_CONFIG_OVERRIDE_PATH", silent=True)

    app.register_blueprint(api.api_blueprint, url_prefix="/api")

    models.db.init_app(app)

    return app
