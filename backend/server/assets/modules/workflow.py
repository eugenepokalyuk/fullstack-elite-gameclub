from .database import *
from datetime import datetime
from uuid import uuid4


def create_user(data) -> None:
    user_exists = login_user(data)
    if user_exists:
        raise Exception("User already registred")
    else:
        db = Session()
        uuid = str(uuid4())
        new_user = Users(uuid=uuid, name=data.name, login=data.login, password=data.password)
        db.add(new_user)
        db.commit()
        return uuid


def login_user(data) -> dict | None:
    db = Session()
    user = db.query(Users.uuid, Users.name).filter(and_(Users.login == data.login, Users.password == data.password)).all()
    if len(user) > 0:
        return {
            'uuid': user[0].uuid,
            'name': user[0].name
        }
    else:
        return None
    

def get_name_by_uuid(_uuid: str) -> str:
    db = Session()
    name = db.scalars(select(Users.name).where(Users.uuid == _uuid)).one()
    return name


def get_session_start_time(sessionId):
    db = Session()
    start_time = db.scalars(select(Sessions.start).where(Sessions.uuid == sessionId)).one()
    return start_time


def start_session(user_uuid: str) -> str:
    session_id = str(uuid4())
    dt_start = datetime.now().strftime(DATE_FORMAT_DEFAULT)
    new_session = Sessions(uuid=session_id, user_uuid=user_uuid, start=dt_start, status='work')
    db = Session()
    db.add(new_session)
    db.commit()
    return session_id


def finish_session(session_id: str) -> None:
    dt_finish = datetime.now().strftime(DATE_FORMAT_DEFAULT)
    db = Session()
    user_session = db.scalars(select(Sessions).where(Sessions.uuid == session_id)).one()
    user_session.finish = dt_finish
    user_session.status = 'closed'
    db.commit()


def get_all_users() -> dict:
    db = Session()
    users = db.query(Users.name, Users.uuid).all()
    return [{'name': u.name, 'uuid': u.uuid} for u in users]


def get_cashout() -> float:
    db = Session()
    balance = db.query(Cashout).first().balance
    return float(balance)


def edit_cashout(amount: float, reason: str) -> None:
    db = Session()

    row = db.query(Cashout).first()
    new_value = float(row.balance) + amount

    now = datetime.now().strftime(DATE_FORMAT_DEFAULT)
    db.add(CashoutHistory(
        old_value=row.balance,
        new_value=new_value,
        reason=reason,
        edit_date=now
    ))
    db.commit()

    row.balance = new_value

    db.commit()


def set_cashout(amount: float) -> None:
    db = Session()
    row = db.query(Cashout).first()
    old_value = float(row.balance)
    row.balance = amount
    now = datetime.now().strftime(DATE_FORMAT_DEFAULT)
    db.add(CashoutHistory(
        old_value=old_value,
        new_value=amount,
        reason='Admin',
        edit_date=now
    ))
    db.commit()
