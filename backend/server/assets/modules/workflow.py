from .database import *
from datetime import datetime
from uuid import uuid4


def create_user(data):
    user_exists = login_user(data)
    if user_exists:
        raise Exception("User already registred")
    else:
        db = Session()
        uuid = str(uuid4())
        new_user = Users(uuid=uuid, name=data.name, login=data.login, password=data.password)
        db.add(new_user)
        db.commit()
        db.close()


def login_user(data):
    db = Session()
    user = db.query(Users.uuid, Users.name).where(Users.login == data.login).where(Users.password == data.password).all()
    db.close()
    if len(user) > 0:
        return {
            'uuid': user[0].uuid,
            'name': user[0].name
        }
    else:
        return None
    

def get_name_by_uuid(_uuid):
    db = Session()
    name = db.scalars(select(Users.name).where(Users.uuid == _uuid)).one()
    db.close()
    return name


def get_session_start_time(sessionId):
    db = Session()
    start_time = db.scalars(select(Sessions.start).where(Sessions.uuid == sessionId)).one()
    db.close()
    return start_time


def start_session(user_uuid):
    session_id = str(uuid4())
    dt_start = datetime.now().strftime(DATE_FORMAT_DEFAULT)
    new_session = Sessions(uuid=session_id, user_uuid=user_uuid, start=dt_start, status='work')
    db = Session()
    db.add(new_session)
    db.commit()
    db.close()
    return session_id


def finish_session(session_id):
    dt_finish = datetime.now().strftime(DATE_FORMAT_DEFAULT)
    db = Session()
    user_session = db.scalars(select(Sessions).where(Sessions.uuid == session_id)).one()
    user_session.finish = dt_finish
    user_session.status = 'closed'
    db.commit()
    db.close()
    