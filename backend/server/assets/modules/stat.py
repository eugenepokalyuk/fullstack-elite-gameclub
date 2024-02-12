from .workflow import get_session_start_time, DATE_FORMAT_DEFAULT, get_cashout, edit_cashout
from .database import *
from datetime import datetime, timedelta


def get_stat(sessionId, start=None, finish=None):

    if start is None:
        start_time = get_session_start_time(sessionId)
    else:
        start_time = start.strftime(DATE_FORMAT_DEFAULT)

    if finish is None:
        finish_time = datetime.now().strftime(DATE_FORMAT_DEFAULT)
    else:
        finish_time = finish.strftime(DATE_FORMAT_DEFAULT)

    db = Session()

    store_data = get_store_stat(start_time, finish_time, db)
    
    device_data = get_device_stat(start_time, db)

    canceled_orders_count = db.scalars(select(func.count(Orders.id))\
                                       .where(and_(Orders.status == 'canceled'),\
                                               and_(Orders.start >= start_time, Orders.start <= finish_time)))\
                                        .one()
    
    writeoff_data = get_writeoff_stat(start_time, finish_time, db)

    supplies_data = get_supply_stat(start_time, finish_time, db)

    expenses_data = get_expenses_stat(start_time, finish_time, db)

    cashout_data = get_cashout()

    response_obj = {
        'storefront': store_data,
        'devices': device_data,
        'canceled': canceled_orders_count,
        'supplies': supplies_data,
        'writeoff': writeoff_data,
        'expenses': expenses_data,
        'cashout': cashout_data,
    }

    if start is None and finish is None:
        response_obj['start_time'] = start_time
    
    return response_obj


def get_expenses_stat(start, finish, db):
    expenses_data = db.query(Expenses).filter(and_(Expenses.date >= start),and_(Expenses.date <= finish)).all()
    return [{
        'amount': float(exp.amount),
        'reason': exp.reason
    } for exp in expenses_data]


def get_store_stat(start, finish, db):
    store_data = db.query(Sold, Storefront.name)\
        .join(Storefront, Sold.item_id == Storefront.id)\
        .filter(and_(Sold.sell_date >= start, Sold.sell_date <= finish))\
            .all()
    
    return [
        {
            'id': sold.id,
            'qty': sold.qty,
            'total': float(sold.total),
            'item_id': sold.item_id,
            'payment': sold.payment,
            'name': storefront_name,
            'uuid': sold.uuid, # Идентификатор чека
            'date': sold.sell_date
        } for sold, storefront_name in store_data]


def get_supply_stat(start, finish, db):
    data = db.query(
                Supplies.item_id,
                func.sum(Supplies.qty).label('total_qty'),
                Storefront.name,
                Supplies.add_date
            )\
            .join(Storefront, Supplies.item_id == Storefront.id)\
                .group_by(Supplies.item_id).where(and_(Supplies.add_date >= start), and_(Supplies.add_date <= finish)).all()
    return [{
        'item_id': id,
        'qty': qty,
        'name': name
    } for id, qty, name, date in data]


def get_device_stat(start, db):
    device_data = db.query(Orders, Pcs.name)\
        .join(Pcs, Orders.pc_id == Pcs.id)\
        .filter(Orders.start >= start)\
        .filter(Orders.status != 'canceled')\
            .all()
        # .filter((Orders.start >= start) & (Orders.status != 'canceled')).all()
    return [
        {
            'id': order.id,
            'pc_id': order.pc_id,
            'price': float(order.price),
            'payment': order.payment,
            'name': pc_name
        } for order, pc_name in device_data]
    

def get_writeoff_stat(start, finish, db):
    result = db.query(
                    WriteOff.type,
                    func.SUM(WriteOff.qty).label('qty'),
                    func.SUM(Storefront.price * WriteOff.qty).label('sum')
                ).join(Storefront, WriteOff.item_id == Storefront.id).filter(
                    WriteOff.wo_date >= start,
                    WriteOff.wo_date <= finish
                ).group_by(WriteOff.type).all()

    writeoff = {}
    for row in result:
        type_, qty, sum_ = row
        writeoff[type_] = {'qty': qty, 'sum': float(sum_)}

    return writeoff


def get_popular_prices():
    db = Session()
    week = (datetime.now() - timedelta(days=7)).strftime(DATE_FORMAT_DEFAULT)
    rows = db.query(func.count().label('count'), Orders.price).\
        filter(func.datetime(Orders.start) > func.datetime(week)).\
        group_by(Orders.price).\
        order_by(text('count DESC')).\
        limit(3).all()
    return [float(o.price) for o in rows]


def add_expense(amount, reason, user_uuid):
    db = Session()
    now = datetime.now().strftime(DATE_FORMAT_DEFAULT)
    db.add(Expenses(amount=amount, reason=reason, date=now, user_uuid=user_uuid))
    db.commit()
    edit_cashout(amount=(0-amount), reason=reason)
