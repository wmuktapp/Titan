import click

import datalake
from datalake import models


@click.command()
@click.option("-k", "--acquire-program-key", type=int, help="The id (database primary key) of the acquire program to "
              "update. If not provided, the details will be registered as a new acquire program.")
@click.option("-p", "--python-name", help="The name of the python module or package that will be called to execute the "
              "acquire program.", required=True)
@click.option("-f", "--friendly-name", help="A friendly name of the acquire program which will be user-facing and must "
              "be unique across all acquire programs.", required=True)
@click.option("-d", "--data-source-name", help="The name of the data source which must be unique across all acquire "
              "programs. This attribute forms a part of the execution taxonomy.", required=True)
@click.option("-a", "--author", help="The author of the acquire program, assumed to be owner of the maintenance of the "
              "program.", required=True)
@click.option("-e",  "--enabled", is_flag=True)
def main(acquire_program_key, python_name, friendly_name, data_source_name, author, enabled):
    program = __import__(python_name)
    if program.__package__:
        command = program.__main__.main
    else:
        command = program.main
    options = {max(option.opts, key=len): option.required for option in command.params}

    app = datalake.create_app()
    with app.app_context():
        if acquire_program_key is None:
            models.insert_acquire_program(python_name, friendly_name, data_source_name, author, enabled, options)
        else:
            models.update_acquire_program(acquire_program_key, python_name, friendly_name, data_source_name, author,
                                          enabled, options)
