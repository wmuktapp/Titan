from azure.storage import blob
import click
import sqlalchemy

from datalake import app
import datalake


def _generate_sql_text(replace, blobs):
    sql_text = """
        IF OBJECT_ID(:credential_name) IS NULL
            CREATE DATABASE SCOPED CREDENTIAL :credential_name 
            WITH IDENTITY = 'SHARED ACCESS SIGNATURE', SECRET = :blob_key;

        IF OBJECT_ID(:data_source_name) IS NULL
            CREATE EXTERNAL DATA SOURCE :data_source_name
            WITH (
                TYPE = BLOB_STORAGE,
                LOCATION = :blob_location,
                CREDENTIAL = :credential_name
            );

        BEGIN TRANSACTION
    """
    if replace:
        sql_text += """
            TRUNCATE TABLE :table_name;
        """
    params = {}
    for index, file_name in enumerate(blobs):
        param_name = "file_name_%s" % index
        params[param_name] = file_name.name
        sql_text += """
            BULK INSERT :table_name
            FROM :%s
            WITH (
                CODEPAGE = :code_page,
                DATAFILETYPE = 'widechar',
                DATASOURCE = :data_source_name,
                FIELDQUOTE = :text_qualifier,
                FIELDTERMINATOR = :field_delimiter,
                FIRSTROW = 2,
                FORMAT = 'CSV',
                MAXERRORS = 1,
                ROWTERMINATOR = :row_delimiter,
                TABLOCK
            );
        """ % param_name
    sql_text += """
            UPDATE :table_name
            SET ExtractKey = :extract_key
            WHERE DataLakeExtractKey IS NULL;
        COMMIT TRANSACTION
    """
    return sql_text, params


@click.command()
@click.option("-s", "--connection-string", help="The pyodbc connection string to be used to connect to the Azure SQL "
              "database.", required=True)
@click.option("-t", "--table-name", help="The name of the table to bulk insert data into. Can include schema.",
              required=True)
@click.option("-b", "--blob-prefix", help="The blob name prefix (client_name/data_souce_name/data_set_name/load_date) "
              "to use to locate the archived data to be extracted.", required=True)
@click.option("-a", "--replace", type=bool, default=False, help="Whether or not the extract table contents will be "
              "replaced or appended to. Defaults to False (appended to).")
@click.option("-f", "--field-delimiter", default=",", help="The delimiter character(s) to split columns / fields by.")
@click.option("-r", "--row-delimiter", default="\n", help="The delimiter character(s) to split rows by.")
@click.option("-q", "--text-qualifier", default="\"", help="The text qualifier / field quote character.")
@click.option("-p", "--code_page", default=65001, help="The code page used to interpret the character set for text "
              "fields.")
@click.option("-c", "--credential-name", default="DataLakeBlobStorageCredential", help="The name of the credential "
              "object to be created on the database (if not already existing) to be used to connect to the azure blob "
              "storage.")
@click.option("-d", "--data-source-name", default="DataLakeBlobStorage", help="The name of the data source object to "
              "be created on the database (if not already existing) to be used to connect to the azure blob storage.")
def main(connection_string, table_name, blob_prefix, replace, field_delimiter, row_delimiter, text_qualifier, code_page,
         credential_name, data_source_name):
    config = datalake.create_app().config
    db = sqlalchemy.create_engine(connection_string)
    service = blob.BlockBlobService(account_name=config["DATALAKE_AZURE_BLOB_ACCOUNT_NAME"],
                                    sas_token=config["DATALAKE_AZURE_BLOB_SAS_TOKEN"])
    container_name = config["DATALAKE_AZURE_BLOB_CONTAINER_NAME"]
    sql_text, params = _generate_sql_text(replace, app.list_block_blobs(service, container_name, blob_prefix))
    blob_location = config["DATALAKE_AZURE_BLOB_ENDPOINT"] + "/" + container_name
    db.engine.execute(sqlalchemy.text(sql_text), table_name=table_name, field_delimiter=field_delimiter,
                      row_delimiter=row_delimiter, text_qualifier=text_qualifier, code_page=code_page,
                      credential_name=credential_name, data_source_name=data_source_name,
                      blob_key=config["DATALAKE_AZURE_BLOB_SAS"], blob_location=blob_location, **params)
