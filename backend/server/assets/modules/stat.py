from datetime import datetime
from .database import SQLiteDB


def get_pc_stat(_from, until):
    start = _from.strftime('%Y-%m-%d %H:%M')
    finish = until.strftime('%Y-%m-%d %H:%M')
    db = SQLiteDB('pc')
    return []


def get_store_stat(_from, until):
    start = _from.strftime('%Y-%m-%d %H:%M')
    finish = until.strftime('%Y-%m-%d %H:%M')
    db = SQLiteDB('pc')
    return []
