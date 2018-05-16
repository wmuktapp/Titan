from setuptools import find_packages, setup


setup(
    name="DataLake",
    author="Adam Cunnington",
    license="MIT",
    packages=find_packages(),
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
            "execute = datalake.scripts.execute:main",
            "orchestrate = datalake.scripts.orchestrate:main",
            "register = datalake.scripts.register:main"
        ]
    }
)
