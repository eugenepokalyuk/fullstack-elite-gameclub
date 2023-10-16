# from .database_old import SQLiteDB
from .workflow import get_session_start_time, DATE_FORMAT_DEFAULT
from datetime import datetime

from .database import *


# def get_pc_stat(_from, until):
#     start = _from.strftime(DATE_FORMAT_DEFAULT)
#     finish = until.strftime(DATE_FORMAT_DEFAULT)
#     db = SQLiteDB('pc')
#     data = db.execute_select_query('select id, pc_id, price, payment from orders where date(finish) between date(?) and date(?)', [ start, finish ])
#     return data


# def get_store_stat(_from, until):
#     start = _from.strftime(DATE_FORMAT_DEFAULT)
#     finish = until.strftime(DATE_FORMAT_DEFAULT)
#     db = SQLiteDB('store')
#     data = db.execute_select_query('select id, qty, total, item_id, payment from sold where date(sell_date) between date(?) and date(?)', [ start, finish ])
#     return data


def get_session_stat(sessionId):
    start_time = get_session_start_time(sessionId)
    now = datetime.now().strftime(DATE_FORMAT_DEFAULT)

    db = Session()

    store_data = db.query(Sold, Storefront.name)\
        .join(Storefront, Sold.item_id == Storefront.id)\
        .filter(and_(Sold.sell_date >= start_time, Sold.sell_date <= now)).all()
    
    store_returned = [
        {
            'id': sold.id,
            'qty': sold.qty,
            'total': float(sold.total),
            'item_id': sold.item_id,
            'payment': sold.payment,
            'name': storefront_name,
            'uuid': sold.uuid,
            'date': sold.sell_date
        } for sold, storefront_name in store_data]
    
    device_data = db.query(Orders, Pcs.name)\
        .join(Pcs, Orders.pc_id == Pcs.id)\
        .filter(and_(Orders.start >= start_time, Orders.start <= now), and_(Orders.status != 'canceled')).all()
    
    device_returned = [
        {
            'id': order.id,
            'pc_id': order.pc_id,
            'price': float(order.price),
            'payment': order.payment,
            'name': pc_name
        } for order, pc_name in device_data]
    
    return {
        'storefront': store_returned,
        'devices': device_returned
    }
