import sqlite3
import os.path

db_path = "./data/playground.db"


class SQLiteDB:
    def __init__(self):
        self.db_name = db_path
        self.conn = None

        # check file exists
        if not os.path.exists(db_path):
            # create if not exists
            with open(db_path, 'x'): pass

        self.connect()  # Automatically connect to the database upon object creation.
        
        self.create_tables()


    def connect(self):
        try:
            self.conn = sqlite3.connect(self.db_name)
        except sqlite3.Error as e:
            print(f"Error connecting to database: {e}")
            raise e


    def execute_select_query(self, query, params=[]):
        try:

            cursor = self.conn.cursor()
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            rows = cursor.fetchall()  # Fetch rows

            # Get column names from the cursor description
            column_names = [description[0] for description in cursor.description]

            # Create a list of dictionaries
            result = []
            for row in rows:
                row_dict = {}
                for i, value in enumerate(row):
                    row_dict[column_names[i]] = value
                result.append(row_dict)
            return result  # Return the list of dictionaries
        except sqlite3.Error as e:
            print(f"Error executing query: {e}")
            raise e


    def execute_update_query(self, query, params=[]):
        try:
            cursor = self.conn.cursor()
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            self.conn.commit()  # Commit changes for update/insert operations
        except sqlite3.Error as e:
            print(f"Error executing query: {e}")
            raise e
        # finally:
        #     self.close()


    def create_tables(self):
        # create tables if not exists

        self.execute_update_query('CREATE TABLE IF NOT EXISTS "pcs" (\
                                    "id"	INTEGER NOT NULL UNIQUE,\
                                    "name"	TEXT NOT NULL,\
	                                "status"	TEXT NOT NULL,\
                                    "ip"	TEXT,\
                                    "description"	TEXT,\
                                    PRIMARY KEY("id")\
                                );')
        
        self.execute_update_query('CREATE TABLE IF NOT EXISTS "orders" (\
                                    "id"	INTEGER NOT NULL,\
                                    "pc_id"	INTEGER NOT NULL,\
                                    "start"	TEXT,\
                                    "pause"	TEXT,\
                                    "finish"	TEXT,\
                                    "price"	NUMERIC,\
                                    PRIMARY KEY("id" AUTOINCREMENT)\
                                );')
        
        for i in range(1,31):
            self.execute_update_query(f"INSERT OR IGNORE INTO pcs(id,name,status) VALUES({i},'PC-{i}','online')")


    def close(self):
        if self.conn:
            self.conn.close()
