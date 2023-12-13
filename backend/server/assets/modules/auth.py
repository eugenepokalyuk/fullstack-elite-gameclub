from fastapi import APIRouter, Header, HTTPException
from .database import *
import bcrypt


def auth_by_uuid(_uuid):
    db = Session()
    rows = db.query(Users).where(Users.uuid == _uuid).all()
    if len(rows) == 1:
        return True
    else:
        return None


def auth_admin(input_pwd) -> bool:
    # Проверка пароля с использованием хэша
    db = Session()
    hashed_password = db.query(Cashout.hashed_password).scalar()
    password_valid = bcrypt.checkpw(input_pwd.encode('utf-8'), hashed_password.encode('utf-8'))
    return password_valid


def auth(authorization: str = Header(description="UUID Пользователя")):
    auth = auth_by_uuid(authorization)
    if not auth:
        raise HTTPException(401, detail='Auth failed')
