from .database import SQLiteDB
from .workflow import get_session_start_time, DATE_FORMAT_DEFAULT
from datetime import datetime


def get_pc_stat(_from, until):
    start = _from.strftime(DATE_FORMAT_DEFAULT)
    finish = until.strftime(DATE_FORMAT_DEFAULT)
    db = SQLiteDB('pc')
    data = db.execute_select_query('select id, pc_id, price, payment from orders where date(finish) between date(?) and date(?)', [ start, finish ])
    return data


def get_store_stat(_from, until):
    start = _from.strftime(DATE_FORMAT_DEFAULT)
    finish = until.strftime(DATE_FORMAT_DEFAULT)
    db = SQLiteDB('store')
    data = db.execute_select_query('select id, qty, total, item_id, payment from sold where date(sell_date) between date(?) and date(?)', [ start, finish ])
    return data


def get_session_stat(sessionId):
    start_time = get_session_start_time(sessionId)
    now = datetime.now().strftime(DATE_FORMAT_DEFAULT)

    db = SQLiteDB('store')
    storefront = db.execute_select_query('select sold.uuid, sold.id, sold.qty, sold.total, sold.item_id, sold.payment, storefront.name \
                                         from sold \
                                         join storefront ON sold.item_id=storefront.id\
                                         where datetime(sell_date) between datetime(?) and datetime(?)', [start_time, now])

    db = SQLiteDB('pc')
    devices = db.execute_select_query('select orders.id, orders.pc_id, orders.price, orders.payment, pcs.name \
                                      from orders \
                                      join pcs ON orders.pc_id=pcs.id\
                                      where datetime(start) between datetime(?) and datetime(?)', [start_time, now])
    return {
        'storefront': storefront,
        'devices': devices
    }