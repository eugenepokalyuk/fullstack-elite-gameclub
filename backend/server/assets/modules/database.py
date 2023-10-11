import sqlite3
import os.path


db_path_pc = "./data/computers.db"
db_path_store = "./data/store.db"
db_path_workflow = "./data/workflow.db"


def get_db_path(db_type):
    if db_type == 'store':
        return db_path_store
    if db_type == 'pc':
        return db_path_pc
    if db_type == 'workflow':
        return db_path_workflow
    if db_type is None:
        raise Exception("Unknown database")


class SQLiteDB:
    def __init__(self, db_type=None):
        
        self.conn = None
        self.db_name = get_db_path(db_type)
        self.init_files()
        self.connect()  # Automatically connect to the database upon object creation.
        self.init_table(db_type)

    def connect(self):
        try:
            self.conn = sqlite3.connect(self.db_name, timeout=10)
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

            cursor.close()

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
            cursor.close()
        except sqlite3.Error as e:
            print(f"Error executing query: {e}")
            raise e


    def init_table(self, db_type):
        if db_type == 'pc':
            self.init_tables_pc()
        if db_type == 'store':
            self.init_tables_store()
        if db_type == 'workflow':
            self.init_tables_worflow()


    def init_tables_pc(self):
        self.execute_update_query('CREATE TABLE IF NOT EXISTS "pcs" (\
                                    "id"	INTEGER NOT NULL UNIQUE,\
                                    "name"	TEXT NOT NULL,\
	                                "status"	TEXT NOT NULL,\
	                                "grid_id"	INTEGER NOT NULL UNIQUE,\
                                    "ip"	TEXT,\
                                    "description"	TEXT,\
                                    PRIMARY KEY("id")\
                                );')
        
        self.execute_update_query('CREATE TABLE IF NOT EXISTS "orders" (\
                                    "id"	INTEGER NOT NULL,\
                                    "uuid"	INTEGER,\
                                    "pc_id"	INTEGER NOT NULL,\
                                    "start"	TEXT,\
                                    "pause"	TEXT,\
                                    "finish"	TEXT,\
                                    "price"	NUMERIC,\
                                    "payment"	TEXT,\
                                    PRIMARY KEY("id" AUTOINCREMENT)\
                                );')
        
        for i in range(1,32):
            if i == 31:
                name = 'PS5'
            else:
                name = f'PC-{i}'
            self.execute_update_query("INSERT OR IGNORE INTO pcs(id, name, status, grid_id) VALUES(?,?,?,?)",
                                      [i, name, 'online', (i-1)])


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
                                    "uuid"  TEXT,\
                                    "item_id"	INTEGER,\
                                    "qty"	INTEGER,\
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
        

    def init_tables_worflow(self):
        self.execute_update_query('CREATE TABLE IF NOT EXISTS "users" (\
                                    "id"	INTEGER UNIQUE,\
                                    "uuid"	TEXT UNIQUE,\
                                    "name"	TEXT,\
                                    "login"	TEXT,\
                                    "password"	TEXT,\
                                    PRIMARY KEY("id" AUTOINCREMENT)\
                                );')
        
        self.execute_update_query('CREATE TABLE IF NOT EXISTS "sessions" (\
                                    "id"	INTEGER UNIQUE,\
                                    "uuid"	TEXT,\
                                    "user_uuid"	TEXT,\
                                    "start"	TEXT,\
                                    "finish"	TEXT,\
                                    "status"	TEXT,\
                                    PRIMARY KEY("id" AUTOINCREMENT)\
                                );')


    def init_files(self):
        # check dir exists
        if not os.path.exists('./data'):
            os.mkdir('./data')

        if not os.path.exists(self.db_name):
            with open(self.db_name, "w") as f:
                f.close()
