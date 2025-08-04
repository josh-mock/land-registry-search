import psycopg2


def insert(csvs_dict, database_consts):
    try:
        connection = psycopg2.connect(
            user=database_consts["DB_USER"],
            password=database_consts["DB_PASSWORD"],
            host=database_consts["DB_HOST"],
            port=database_consts["DB_PORT"],
            dbname=database_consts["DB_NAME"],
        )
        print("Connection successful!")

        cursor = connection.cursor()

        tables = ", ".join(csvs_dict.keys())
        print(f"Truncating tables: {tables}")
        cursor.execute(f"TRUNCATE TABLE {tables};")
        connection.commit()

        for table, csvs in csvs_dict.items():
            for csv in csvs:
                print(f"Inserting {csv} into {table}")
                with open(csv, "r") as f:
                    next(f)
                    sql = f"COPY {table} FROM STDIN WITH CSV"
                    cursor.copy_expert(sql, f)

        print("Refreshing materialized view...")
        cursor.execute("REFRESH MATERIALIZED VIEW top_proprietors;")

        connection.commit()
        print("Data inserted successfully.")

    except Exception as e:
        print(f"Failed to insert data: {e}")
        if connection:
            connection.rollback()

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
        print("Connection closed.")
