class _Config(object):
    pass


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