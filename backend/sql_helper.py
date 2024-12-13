from os import path
import os
import pandas as pd
import pyodbc
import sqlite3
from sqlalchemy import create_engine  
from databricks import sql
from urllib import parse
from dotenv import load_dotenv


load_dotenv()

#connecting_string = f"Driver={{ODBC Driver 17 for SQL Server}};Server=tcp:localhost\sqlexpress;Database=Northwind;Uid=sa;Pwd=Treetop@123;"
connecting_string = os.getenv("SQL_SERVER_CONNECTION_STRING")
params = parse.quote_plus(connecting_string)


azure_databricks_connection = sql.connect(
                        server_hostname = "adb-96818132019408.8.azuredatabricks.net",
                        http_path = "/sql/1.0/warehouses/4a84df21a5e7b839",
                        access_token = "dapi6f1a22d6a9ee31acbe3b504e01733765")

db_path = path.join(path.dirname(__file__), 'data', 'northwind.db')
sqllite_engine = create_engine(f'sqlite:///{db_path}')  
#sqlserver_engine = create_engine("mssql+pyodbc:///?odbc_connect=%s" % params)
sqlserver_engine = create_engine(connecting_string)
#conn = pyodbc.connect(conn_str)

sqllite_query = """    
        SELECT m.name AS TABLE_NAME, p.name AS COLUMN_NAME, p.type AS DATA_TYPE  
        FROM sqlite_master AS m  
        JOIN pragma_table_info(m.name) AS p  
        WHERE m.type = 'table'  
        """  
sqlserver_query = """    
            SELECT 
            TABLE_NAME = t.TABLE_NAME, 
            COLUMN_NAME = c.COLUMN_NAME, 
            DATA_TYPE = c.DATA_TYPE
            FROM 
                INFORMATION_SCHEMA.TABLES t
            JOIN 
                INFORMATION_SCHEMA.COLUMNS c ON t.TABLE_NAME = c.TABLE_NAME AND t.TABLE_SCHEMA = c.TABLE_SCHEMA
            WHERE 
                t.TABLE_TYPE = 'BASE TABLE'
            ORDER BY 
                t.TABLE_NAME, c.ORDINAL_POSITION; 
            """  

if(os.getenv("USE_SQLLITE") == 'True'):
    _sql_query = sqllite_query
    _engine = sqllite_engine
    sqldb = "SQLite"
else:
    _sql_query = sqlserver_query
    _engine = sqlserver_engine
    sqldb = "Microsoft SQL Server"
    


def select_sql_table_schema():
    
    result = pd.read_sql_query(_sql_query, _engine)
    result = result.infer_objects()
    current_table = ''  
    columns = [] 
    output=[]

    for index, row in result.iterrows():
        table_name = f"{row['TABLE_NAME']}" 

        column_name = row['COLUMN_NAME']  
        data_type = row['DATA_TYPE']   
        if " " in table_name:
            table_name= f"[{table_name}]" 
        column_name = row['COLUMN_NAME']  
        if " " in column_name:
            column_name= f"[{column_name}]" 

        # If the table name has changed, output the previous table's information  
        if current_table != table_name and current_table != '':  
            output.append(f"table: {current_table}, columns: {', '.join(columns)}")  
            columns = []  
        
        # Add the current column information to the list of columns for the current table  
        columns.append(f"{column_name} {data_type}")  
        
        # Update the current table name  
        current_table = table_name  
        
        # Output the last table's information  
    output.append(f"Use SQL Fuctions that is supported in {sqldb}, tables: {current_table}, columns: {', '.join(columns)}")
    output = "\n ".join(output)
    return output  



from databricks import sql
import pandas as pd
import os

def get_adb_sql_table_schema():
    # Securely retrieve the access token from an environment variable
    access_token = os.getenv("DATABRICKS_ACCESS_TOKEN")
    
    # Connection details
    server_hostname = "adb-96818132019408.8.azuredatabricks.net"
    http_path = "/sql/1.0/warehouses/4a84df21a5e7b839"
    

    
    # Create a cursor
    cursor = azure_databricks_connection.cursor()
    
    # SQL query to get table schema from INFORMATION_SCHEMA
    sql_query = """
    SELECT 
        table_name,
        column_name,
        data_type
    FROM
        information_schema.columns
    WHERE
        table_catalog = 'anildwa_adb_96818132019408'
        AND table_schema = 'default'
        AND table_name = 'tpcds_customer_table'
    ORDER BY
        table_name, ordinal_position
    """
    
    # Execute the query and fetch results
    cursor.execute(sql_query)
    result = cursor.fetchall()
    column_names = [desc[0] for desc in cursor.description]
    
    # Close the cursor and connection
    cursor.close()
    
    
    # Convert results to DataFrame
    result_df = pd.DataFrame(result, columns=column_names)
    result_df = result_df.infer_objects()
    
    # Process the DataFrame to format the output
    current_table = ''
    columns = []
    output = []
    
    for index, row in result_df.iterrows():
        table_name = f"{row['table_name']}"
        column_name = row['column_name']
        data_type = row['data_type']
        
        # Handle spaces in names
        if " " in table_name:
            table_name = f"[{table_name}]"
        if " " in column_name:
            column_name = f"[{column_name}]"
        
        # If the table name has changed, output the previous table's information
        if current_table != table_name and current_table != '':
            output.append(f"Table: {current_table}, Columns: {', '.join(columns)}")
            columns = []
        
        # Add the current column information to the list of columns for the current table
        columns.append(f"{column_name} {data_type}")
        
        # Update the current table name
        current_table = table_name
    
    # Output the last table's information
    output.append(f"Use SQL functions that are supported, Table: {current_table}, Columns: {', '.join(columns)}")
    output_str = "\n".join(output)
    
    return output_str




def execute_sql(sql_query: str):
    import pandas as pd
    """execute a sql query and return the execution result."""
    df = pd.read_sql_query(sql_query, _engine)
    return df


def execute_adb_sql(sql_query: str):
    from databricks import sql
    import pandas as pd
    
    # Create a cursor and execute your query
    cursor = azure_databricks_connection.cursor()
    cursor.execute(sql_query)

    # Fetch all results
    results = cursor.fetchall()

    # Get column names from cursor description
    column_names = [desc[0] for desc in cursor.description]

    # Create a pandas DataFrame
    df = pd.DataFrame(results, columns=column_names)

    # Display the DataFrame
    print(df)
    return df
    # Close the cursor and connection
    cursor.close()
    #azure_databricks_connection.close()
