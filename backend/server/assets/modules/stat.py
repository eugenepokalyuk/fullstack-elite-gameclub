from datetime import datetime
from .database import SQLiteDB


def get_pc_stat(_from, until):
    start = _from.strftime('%Y-%m-%d %H:%M')
    finish = until.strftime('%Y-%m-%d %H:%M')
    db = SQLiteDB('pc')
    data = db.execute_select_query('select id, pc_id, price, payment from orders where date(finish) between date(?) and date(?)', [ start, finish ])
    return data


def get_store_stat(_from, until):
    start = _from.strftime('%Y-%m-%d %H:%M')
    finish = until.strftime('%Y-%m-%d %H:%M')
    db = SQLiteDB('store')
    data = db.execute_select_query('select id, qty, total, item_id from sold where date(sell_date) between date(?) and date(?)', [ start, finish ])
    return data
