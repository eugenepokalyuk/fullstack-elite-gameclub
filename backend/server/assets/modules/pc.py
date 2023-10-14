from .workflow import DATE_FORMAT_DEFAULT
from .database import *
from datetime import datetime, timedelta
from uuid import uuid4



def get_pc_data():
    db = Session()
    data = db.query(Pcs).all()
    pc_array = []
    for row in data:
        pc_obj = {
            'id': row.id,
            'status': row.status,
            'name': row.name,
            'grid_id': row.grid_id
        }
        if row.status == 'playing' or row.status == 'pause':
            order_data = db.query(Orders).where(Orders.pc_id == row.id).all()[0]
            start = datetime.strptime(order_data.start, DATE_FORMAT_DEFAULT)
            finish = datetime.strptime(order_data.finish, DATE_FORMAT_DEFAULT)
            pc_obj['details'] = {
                'price': float(order_data.price),
                'payment': order_data.payment,
                'time':{
                    'from': {
                        'hours':start.hour,
                        'minutes':start.minute
                    },
                    'until':{
                        'hours':finish.hour,
                        'minutes':finish.minute
                    }
                }
            }
        if row.status == 'techWorks':
            pc_obj['details'] = {
                'reason': row.description
            }
        pc_array.append(pc_obj)
    db.close()
    return pc_array


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
        new_order = Orders(uuid=pc_session_id, pc_id=pc_id, start=start, finish=finish, price=price, payment=payment_type)
        db.add(new_order)
        pc.status = 'playing'
        db.commit()
        db.close()
        return pc_session_id
    else:
        db.close()
        raise Exception("PC Status is not online")


def pause(pc_id):
    db = Session()
    pc = db.scalars(select(Pcs).where(Pcs.id == pc_id)).one()
    if pc.status == 'playing':
        pc.status='pause'
        db.commit()
        db.close()
    else:
        db.close()
        raise Exception("PC is not in playing status")


def continue_play(pc_id):
    db = Session()
    pc = db.scalars(select(Pcs).where(Pcs.id == pc_id)).one()
    if pc.status == 'pause':
        order = db.query(Orders).where(Orders.pc_id == pc_id).order_by(desc(Orders.id)).limit(1).all()[0]

        start_time = datetime.strptime(order.start, DATE_FORMAT_DEFAULT)
        finish_old = datetime.strptime(order.finish, DATE_FORMAT_DEFAULT)

        now = datetime.now()
        delta = now - start_time
        total_seconds = delta.total_seconds()

        finish_new = (finish_old + delta).strftime(DATE_FORMAT_DEFAULT)
        
        hours = int(total_seconds // 3600)
        minutes = int((total_seconds % 3600) // 60)
        pause = f'h:{hours};m:{minutes}'
        order.pause = pause
        order.finish = finish_new
        pc.status = 'playing'
        db.commit()
        db.close()
    else:
        db.close()
        raise Exception("PC is not in playing status")
    

def finish(pc_id, price=None, payment=None):
    db = Session()
    pc = db.scalars(select(Pcs).where(Pcs.id == pc_id)).one()
    
    if pc.status == 'playing':
        pc.status = 'online'

        order = db.query(Orders).where(Orders.pc_id == pc_id).order_by(desc(Orders.id)).limit(1).all()[0]

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
                new_price = price - float(order.price)
                new_order = Orders(uuid=new_uuid, pc_id=pc_id, start=order.finish, finish=real_finish, price=new_price, payment=new_payment)
                db.add(new_order)

            if now <= finish_time:
                order.finish = real_finish
                order.price = price

        db.commit()
        db.close()
    else:
        db.close()
        raise Exception("PC Status is not playing")
    

def start_tech_works(pc_id, reason):
    db = Session()
    pc = db.scalars(select(Pcs).where(Pcs.id == pc_id)).one()
    pc.status = 'techWorks'
    pc.description = reason
    db.commit()
    db.close()


def stop_tech_works(pc_id):
    db = Session()
    pc = db.scalars(select(Pcs).where(Pcs.id == pc_id)).one()
    pc.status = 'techWorks'
    pc.description = None
    db.commit()
    db.close()


def set_grid_id(pc_id, grid_id):
    db = Session()
    pc = db.scalars(select(Pcs).where(Pcs.id == pc_id)).one()
    pc.grid_id = grid_id
    db.commit()
    db.close()


def set_pc_name(pc_id, name):
    db = Session()
    pc = db.scalars(select(Pcs).where(Pcs.id == pc_id)).one()
    pc.name = name
    db.commit()
    db.close()


def remove_pc(pc_id):
    db = Session()
    pc = db.scalars(select(Pcs).where(Pcs.id == pc_id)).one()
    db.delete(pc)    
    db.commit()
    db.close()
