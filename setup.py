from setuptools import find_packages, setup


setup(
    name="DataLake",
    author="Adam Cunnington",
    license="MIT",
    packages=find_packages(),
    install_requires=[
        "click"
    ],
    entry_points={
        "console_scripts": ["test = datalake.test:main"]
    }
)
