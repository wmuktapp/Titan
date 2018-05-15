class _Config(object):
    DATALAKE_ACQUIRE_TIMEOUT = 3600  # Seconds
    DEBUG = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevelopmentConfig(_Config):
    DEBUG = True
    SQLALCHEMY_TRACK_MODIFICATIONS = True


class TestConfig(_Config):
    pass


class ProductionConfig(_Config):
    pass


CONFIGURATIONS = {
    "dev": DevelopmentConfig,
    "test": TestConfig,
    "prod": ProductionConfig
}
