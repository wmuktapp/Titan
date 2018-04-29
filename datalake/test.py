import click


@click.command()
@click.option("-t", "--test", required=False)
def main(test):
	print("i was executed")
