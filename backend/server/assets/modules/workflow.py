from .database import SQLiteDB
from datetime import datetime
from uuid import uuid4

DATE_FORMAT_DEFAULT = '%Y-%m-%d %H:%M:%S'

def create_user(data):
    db = SQLiteDB('workflow')
    user_exists = login_user(data)
    if user_exists:
        raise Exception("User already registred")
    else:
        uuid = str(uuid4())
        db.execute_update_query('insert into users (uuid, name, login, password) values(?,?,?,?)', 
                                [ uuid, data.name, data.login, data.password ])
    return uuid


def login_user(data):
    db = SQLiteDB('workflow')
    row = db.execute_select_query('select count(*) as auth, uuid, name from users where login=? and password=?', 
                                         [ data.login, data.password ])[0]
    if int(row['auth']) == 1:
        return {
            'uuid': row['uuid'],
            'name': row['name']
        }
    else:
        return None
    

def get_name_by_uuid(_uuid):
    db = SQLiteDB('workflow')
    name = db.execute_select_query('select name from users where uuid=?', [ _uuid ])[0]['name']
    return name


def get_session_start_time(sessionId):
    db = SQLiteDB('workflow')
    row = db.execute_select_query('select start from sessions where uuid=?', [ sessionId ])
    if len(row) > 0:
        return row[0]['start']
    else:
        raise Exception(f'Unkown session. SessionId:{sessionId}')


def start_session(user_uuid):
    db = SQLiteDB('workflow')
    session_id = str(uuid4())
    dt_start = datetime.now().strftime(DATE_FORMAT_DEFAULT)
    db.execute_update_query('insert into sessions (uuid, user_uuid, start, status) values (?,?,?,?)', 
                            [session_id, user_uuid, dt_start, 'work'])
    return session_id


def finish_session(session_id):
    dt_finish = datetime.now().strftime(DATE_FORMAT_DEFAULT)
    db = SQLiteDB('workflow')
    db.execute_update_query('update sessions set finish=?, status=? where uuid=?', [ dt_finish, 'closed', session_id ])
    