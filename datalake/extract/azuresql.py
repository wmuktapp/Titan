import click


@click.command()
@click.option()
def main():
    # connection string, action (append / replace), table name (incl. schema), column delimiter, row delimiter,
    # text qualifier, codepage (65001 default UTF8)

    # key considerations:
    # use DATAFILETYPE=widechar
    # use MAXERRORS=1

    # create database scoped credential (if not exists?). If master key not created, it will error (?) - that's fine.
    # assume table is already there? that way, up to user as to whether or not they do type casting etc.
