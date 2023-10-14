from fastapi import APIRouter, Header, HTTPException
# from .database_old import SQLiteDB
from .database import *


def auth_by_uuid(_uuid):
    db = Session()
    rows = db.query(Users).where(Users.uuid == _uuid).all()
    if len(rows) == 1:
        return True
    else:
        return None


def auth(authorization: str = Header(description="UUID Пользователя")):
    auth = auth_by_uuid(authorization)
    if not auth:
        raise HTTPException(401, detail='Auth failed')
