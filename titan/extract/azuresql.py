import json
import os
import posixpath
import uuid

from azure.storage import blob
import click
import sqlalchemy

from titan import app
import titan


_EXTRACT_KEY_COLUMN_NAME = "TitanExtractKey"


def _generate_sql_text(blobs, replace, credential_name, data_source_name, table_name, view_name):
    # We don't care about SQL injection risk as we are connecting to db's that the user provides the connection string
    # of. If they wanted to do harm, they could do it anyway.
    # We also have to create a 'temporary' (create before and delete after) view that sits on top of the underlying
    # table because the source won't contain the extract key.
    sql_text = f"""
        IF OBJECT_ID(:credential_name) IS NULL
            CREATE DATABASE SCOPED CREDENTIAL {credential_name} 
            WITH IDENTITY = 'SHARED ACCESS SIGNATURE', SECRET = :blob_key;

        IF OBJECT_ID(:data_source_name) IS NULL
            CREATE EXTERNAL DATA SOURCE {data_source_name}
            WITH (
                TYPE = BLOB_STORAGE,
                LOCATION = :blob_location,
                CREDENTIAL = {credential_name}
            );

        BEGIN TRANSACTION
        
        DECLARE @SQL NVARCHAR(MAX) = 'CREATE VIEW :view_name AS SELECT ' + (
            SELECT STRING_AGG('[' + COLUMN_NAME + ']', ',') WITHIN GROUP (ORDER BY ORDINAL_POSITION)
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = :schema
                AND TABLE_NAME = :table_name
                AND COLUMN_NAME <> :_EXTRACT_KEY_COLUMN_NAME
            GROUP BY TABLE_NAME
        ) + ' FROM {table_name}';
    
        EXEC(@SQL);
    """
    if replace:
        sql_text += f"""
            TRUNCATE TABLE {table_name};
        """
    params = {}
    for index, blob in enumerate(blobs):
        param_name = "file_name_%s" % index
        params[param_name] = blob.name
        sql_text += f"""
            BULK INSERT {table_name}
            FROM :{param_name}
            WITH (
                CODEPAGE = :code_page,
                DATA_SOURCE = :data_source_name,
                FIELDQUOTE = :text_qualifier,
                FIELDTERMINATOR = :field_delimiter,
                FIRSTROW = 2,
                FORMAT = 'CSV',
                MAXERRORS = 1,
                ROWTERMINATOR = :row_delimiter,
                TABLOCK
            );
        """
    sql_text += f"""
            UPDATE {table_name}
            SET {_EXTRACT_KEY_COLUMN_NAME} = :extract_key
            WHERE {_EXTRACT_KEY_COLUMN_NAME} IS NULL;
            
            DROP VIEW {view_name}
        COMMIT TRANSACTION
    """
    return sql_text.replace("\n", " "), params


@click.command()
@click.option("-s", "--connection-string", help="The pyodbc connection string to be used to connect to the Azure SQL "
              "database.", required=True)
@click.option("-t", "--table-name", help="The name of the table to bulk insert data into. Can include schema.",
              required=True)
@click.option("-a", "--replace", type=bool, default=False, help="Whether or not the extract table contents will be "
              "replaced or appended to. Defaults to False (appended to).")
@click.option("-f", "--field-delimiter", default=",", help="The delimiter character(s) to split columns / fields by."
              "Defaults to ,")
@click.option("-r", "--row-delimiter", default="0x0a", help="The delimiter character(s) to split rows by. Defaults to "
              "line feed character (\n) expressed as a hex value to get around Microsoft bug. For the same reason, if "
              "file ends with carraige return and line feed, pass \n, not \r\n as \n is interpreted as both.")
@click.option("-q", "--text-qualifier", default="\"", help="The text qualifier / field quote character. Defaults to \"")
@click.option("-p", "--code_page", default=65001, help="The code page used to interpret the character set for text "
              "fields. Defaults to 65001.")
@click.option("-c", "--credential-name", default="TitanBlobStorageCredential", help="The name of the credential "
              "object to be created on the database (if not already existing) to be used to connect to the azure blob "
              "storage. Defaults to TitanBlobStorageCredential.")
@click.option("-d", "--data-source-name", default="TitanBlobStorage", help="The name of the data source object to "
              "be created on the database (if not already existing) to be used to connect to the azure blob storage."
              "Defaults to TitanBlobStorage.")
def main(connection_string, table_name, replace, field_delimiter, row_delimiter, text_qualifier, code_page,
         credential_name, data_source_name):
    """Initial a BULK INSERT transaction from the Azure SQL database to retrieve files from Titan's Blob storage.

    If there are multiple files, the BULK INSERTs will be wrapped inside of a single transaction.

    """
    flask_app = titan.create_app("azuresql")
    container_name = flask_app.config["TITAN_AZURE_BLOB_CONTAINER_NAME"]
    blob_location = posixpath.join(flask_app.config["TITAN_AZURE_BLOB_ENDPOINT"], container_name)
    sas_token = flask_app.config["TITAN_AZURE_BLOB_SAS_TOKEN"]
    service = blob.BlockBlobService(account_name=flask_app.config["TITAN_AZURE_BLOB_ACCOUNT_NAME"], sas_token=sas_token)
    data = json.loads(os.getenv("TITAN_STDIN"))
    execution = data["execution"]
    blob_prefix = posixpath.join(execution["ExecutionClientName"], execution["ExecutionDataSourceName"],
                                 execution["ExecutionDataSetName"], execution["ExecutionLoadDate"],
                                 execution["ExecutionVersion"])
    view_name = "%s_%s" % (table_name, uuid.uuid4())
    sql_text, params = _generate_sql_text(app.list_blobs(service, container_name, blob_prefix), replace,
                                          credential_name, data_source_name, table_name, view_name)
    db = sqlalchemy.create_engine(connection_string)
    flask_app.logger.info("Extracting data to database...")
    blob_key = sas_token[1:] if next(iter(sas_token), None) == "?" else sas_token  # needed because silly microsoft
    if "." in table_name:
        schema, table_name = table_name.split(".")
    else:
        schema = "dbo"
    db.engine.execute(sqlalchemy.text(sql_text), field_delimiter=field_delimiter, row_delimiter=row_delimiter,
                      text_qualifier=text_qualifier, code_page=code_page, credential_name=credential_name,
                      data_source_name=data_source_name, blob_key=blob_key, blob_location=blob_location, schema=schema,
                      extract_key=data["extract"]["ExtractKey"], table_name=table_name, view_name=view_name,
                      _EXTRACT_KEY_COLUMN_NAME=_EXTRACT_KEY_COLUMN_NAME, **params)
