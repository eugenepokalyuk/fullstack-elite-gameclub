from .workflow import DATE_FORMAT_DEFAULT, edit_cashout
from .database import *
from datetime import datetime, timedelta
from uuid import uuid4
import requests
import time


def get_pc_data():
    db = Session()
    data = db.query(Pcs).all()
    pc_array = []
    for row in data:
        pc_obj = {
            'id': row.id,
            'status': row.status,
            'name': row.name,
            'grid_id': row.grid_id,
            'blocked': row.blocked == 1
        }

        if row.ip != None and row.ip != "":
            if not ping_pc(row.ip):
                pc_obj["status"] = 'offline'
                
        if row.status == 'playing' or row.status == 'pause':
            order_data = db.query(Orders).where(Orders.pc_id == row.id).all()[0]
            start = datetime.strptime(order_data.start, DATE_FORMAT_DEFAULT)
            finish = datetime.strptime(order_data.finish, DATE_FORMAT_DEFAULT)
            pc_obj['details'] = {
                'price': float(order_data.price),
                'payment': order_data.payment,
                'time':{
                    'from': {
                        'timestamp': time.mktime(start.timetuple())
                        # 'hours':start.hour,
                        # 'minutes':start.minute
                    },
                    'until':{
                        'timestamp': time.mktime(finish.timetuple())
                        # 'hours':finish.hour,
                        # 'minutes':finish.minute
                    }
                }
            }
        if row.status == 'techWorks':
            pc_obj['details'] = {
                'reason': row.description
            }
        pc_array.append(pc_obj)
    return pc_array


def ping_pc(ip):
    try:
        response = requests.get(f'http://{ip}/ping', timeout=3)
        if response.status_code == 200:
            return True
        else:
            return False
    except requests.exceptions.Timeout:
        return False


def play(time, price, pc_id, payment_type):
    db = Session()
    pc = db.scalars(select(Pcs).where(Pcs.id == pc_id)).one()
    if pc.status == 'online':
        hours = time.hours
        minutes = time.minutes
        now = datetime.now()
        start = now.strftime(DATE_FORMAT_DEFAULT)
        finish = (now + timedelta(hours=int(hours), minutes=int(minutes))).strftime(DATE_FORMAT_DEFAULT)
        pc_session_id = str(uuid4())
        new_order = Orders(uuid=pc_session_id, pc_id=pc_id, start=start, finish=finish, price=price, payment=payment_type, status='play')
        db.add(new_order)
        pc.status = 'playing'
        db.commit()
        if payment_type == 'cash':
            edit_cashout(price, 'order')
        return pc_session_id
    else:
        raise Exception("PC Status is not online")


def pause(pc_id):
    db = Session()
    pc = db.scalars(select(Pcs).where(Pcs.id == pc_id)).one()
    if pc.status == 'playing':
        order = db.query(Orders).where(Orders.pc_id == pc_id).order_by(desc(Orders.id)).first()
        order.status='pause'
        order.pause=datetime.now().strftime(DATE_FORMAT_DEFAULT)
        pc.status='pause'
        db.commit()
    else:
        raise Exception("PC is not in playing status")


def continue_play(pc_id):
    db = Session()
    pc = db.scalars(select(Pcs).where(Pcs.id == pc_id)).one()
    if pc.status == 'pause':
        order = db.query(Orders).where(Orders.pc_id == pc_id).order_by(desc(Orders.id)).first()

        order.status='play'

        pause_start = datetime.strptime(order.pause, DATE_FORMAT_DEFAULT)
        finish_old = datetime.strptime(order.finish, DATE_FORMAT_DEFAULT)

        now = datetime.now()
        delta = now - pause_start

        finish_new = (finish_old + delta).strftime(DATE_FORMAT_DEFAULT)
        
        order.finish = finish_new
        pc.status = 'playing'
        db.commit()
    else:
        raise Exception("PC is not in playing status")
    

def finish(pc_id, price=None, payment=None):
    db = Session()
    pc = db.scalars(select(Pcs).where(Pcs.id == pc_id)).one()
    
    if pc.status == 'playing':
        pc.status = 'online'

        order = db.query(Orders).where(Orders.pc_id == pc_id).order_by(desc(Orders.id)).limit(1).all()[0]
        order.status = 'finished'

        if payment != None:
            order.payment = payment

        if price != None:
            now = datetime.now()
            finish_time = datetime.strptime(order.finish, DATE_FORMAT_DEFAULT)

            real_finish = now.strftime(DATE_FORMAT_DEFAULT)

            if now >= finish_time:
                new_uuid = str(uuid4())
                if payment != None:
                    new_payment = payment
                else:
                    new_payment = order.payment
                    # change cashout balance
                new_price = price - float(order.price)
                new_order = Orders(uuid=new_uuid, pc_id=pc_id, start=order.finish, finish=real_finish, price=new_price, payment=new_payment, status='finished')
                db.add(new_order)

            if now <= finish_time:
                order.finish = real_finish
                order.price = price

        db.commit()
    else:
        raise Exception("PC Status is not playing")
    

def swap(pc_id, new_pc_id):
    db = Session()
    pc = db.scalars(select(Pcs).where(Pcs.id == pc_id)).one()
    pc.status = 'online'
    new_pc = db.scalars(select(Pcs).where(Pcs.id == new_pc_id)).one()
    new_pc.status = 'playing'
    order = db.query(Orders).where(Orders.pc_id == pc_id).order_by(desc(Orders.id)).limit(1).all()[0]
    order.pc_id = new_pc_id
    db.commit()


def cancel(pc_id):
    db = Session()
    pc = db.scalars(select(Pcs).where(Pcs.id == pc_id)).one()
    pc.status = 'online'
    order = db.query(Orders).where(Orders.pc_id == pc_id).order_by(desc(Orders.id)).limit(1).all()[0]
    order.status = 'canceled'
    db.commit()


def start_tech_works(pc_id, reason):
    with Session() as db:
        pc = db.scalars(select(Pcs).where(Pcs.id == pc_id)).one()
        pc.status = 'techWorks'
        pc.description = reason
        db.commit()
        # send block request


def stop_tech_works(pc_id):
    with Session() as db:
        pc = db.scalars(select(Pcs).where(Pcs.id == pc_id)).one()
        pc.status = 'techWorks'
        pc.description = None
        db.commit()
        # send unblock request


def set_pc_ip(pc_id, ip):
    db = Session()
    pc = db.scalars(select(Pcs).where(Pcs.id == pc_id)).one()
    pc.ip = ip
    db.commit()


def set_grid_id(pc_id, grid_id):
    db = Session()
    pc = db.scalars(select(Pcs).where(Pcs.id == pc_id)).one()
    pc.grid_id = grid_id
    db.commit()


def set_pc_name(pc_id, name):
    db = Session()
    pc = db.scalars(select(Pcs).where(Pcs.id == pc_id)).one()
    pc.name = name
    db.commit()


def set_pc_ip(pc_id, ip):
    db = Session()
    pc = db.scalars(select(Pcs).where(Pcs.id == pc_id)).one()
    pc.ip = ip
    db.commit()


def remove_pc(pc_id):
    db = Session()
    pc = db.scalars(select(Pcs).where(Pcs.id == pc_id)).one()
    db.delete(pc)    
    db.commit()


def block_pc(pc_id, text):
    db = Session()
    pc = db.query(Pcs).where(Pcs.id == pc_id).one()
    if pc.ip != None and pc.ip != "":
        try:
            res = requests.get(f'http://{pc.ip}:8000/block?text={text}', timeout=3, headers={
                'Custom-Header': 'YourSecretKey'
            })
            if res.status_code == 200:
                pc.blocked = 1
                db.commit()
        except requests.exceptions.Timeout:
            print('PC недоступен')


def unblock_pc(pc_id):
    db = Session()
    pc = db.query(Pcs).where(Pcs.id == pc_id).one()
    if pc.ip != None and pc.ip != "":
        try:
            res = requests.get(f'http://{pc.ip}:8000/unblock', timeout=3)
            if res.status_code == 200:
                pc.blocked = 0
                db.commit()
        except requests.exceptions.Timeout:
            print('PC недоступен')
