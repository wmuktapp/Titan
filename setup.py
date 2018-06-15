import setuptools


setuptools.setup(
    name="Titan",
    author="Adam Cunnington",
    license="MIT",
    packages=setuptools.find_packages(),
    install_requires=[
        "applicationinsights",
        "azure",
        "click",
        "flask",
        "flask_sqlalchemy",
        "pyodbc",
        "python-dotenv",
        "sqlalchemy",
        "wrapt"
    ],
    entry_points={
        "console_scripts": [
            "execute = titan.scripts.execute:main",
            "orchestrate = titan.scripts.orchestrate:main",
            "register = titan.scripts.register:main",
            "extract-azure-sql = titan.extract.azuresql:main"
        ]
    }
)
