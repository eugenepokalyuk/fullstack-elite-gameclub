from fastapi import APIRouter, Header, HTTPException
from .database import SQLiteDB


def auth_by_uuid(_uuid):
    db = SQLiteDB('workflow')
    row = db.execute_select_query('select count(*) as auth from users where uuid=?', [ _uuid ])[0]
    if int(row['auth']) == 1:
        return True
    else:
        return None


def auth(authorization: str = Header(description="UUID Пользователя")):
    auth = auth_by_uuid(authorization)
    if not auth:
        raise HTTPException(401, detail='Auth failed')
