import sqlite3
import os.path

db_path_pc = "./data/computers.db"
db_path_store = "./data/store.db"


class SQLiteDB:
    def __init__(self, db_type=''):

        if db_type == 'store':
            self.db_name = db_path_store
        if db_type == 'pc':
            self.db_name = db_path_pc

        self.conn = None

        # check dir exists
        if not os.path.exists('./data'):
            os.mkdir('./data')

        for path in [db_path_pc, db_path_store]:
            # check file exists
            if not os.path.exists(path):
                # create if not exists
                with open(path, 'x'): pass

        self.connect()  # Automatically connect to the database upon object creation.

        if db_type == 'store':
            self.init_tables_store()
        if db_type == 'pc':
            self.init_tables_pc()

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


    def init_tables_pc(self):

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


    def init_tables_store(self):

        self.execute_update_query('CREATE TABLE IF NOT EXISTS "storefront" (\
                                    "id"	INTEGER UNIQUE,\
                                    "name"	TEXT,\
                                    "qty"	INTEGER NOT NULL,\
                                    "price"	NUMERIC,\
	                                "hide"	INTEGER,\
                                    PRIMARY KEY("id" AUTOINCREMENT)\
                                );')
        
        self.execute_update_query('CREATE TABLE IF NOT EXISTS "sold" (\
                                    "id"	INTEGER,\
                                    "item_id"	INTEGER,\
                                    "qty"	TEXT,\
                                    "total"	NUMERIC,\
                                    "payment"	TEXT,\
                                    "sell_date"	TEXT,\
                                    PRIMARY KEY("id" AUTOINCREMENT)\
                                );')
        
        self.execute_update_query('CREATE TABLE IF NOT EXISTS "supplies" (\
                                    "id"	INTEGER,\
                                    "item_id"	INTEGER,\
                                    "qty"	INTEGER,\
                                    "add_date"	TEXT,\
                                    PRIMARY KEY("id" AUTOINCREMENT)\
                                );')
        

    def close(self):
        if self.conn:
            self.conn.close()

