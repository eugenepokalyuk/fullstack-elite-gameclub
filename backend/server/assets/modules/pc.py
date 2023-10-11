from .database import SQLiteDB
from .workflow import DATE_FORMAT_DEFAULT
from datetime import datetime, timedelta
from uuid import uuid4


def get_pc_data():
    db = SQLiteDB('pc')
    data = db.execute_select_query('select * from pcs')
    reponseArray = []

    for pc in data:
        cur_pc = {
            'id': pc['id'],
            'name': pc['name'],   
            'status': pc['status'],
            'grid_id': pc['grid_id']
        }

        if pc['status'] == 'playing' or pc['status'] == 'pause':
            order = db.execute_select_query('select * from orders where pc_id=? order by id desc limit 1', [pc['id']])[0]
            start = datetime.strptime(order['start'], DATE_FORMAT_DEFAULT)
            finish = datetime.strptime(order['finish'], DATE_FORMAT_DEFAULT)
            cur_pc['details'] = {
                'payment': order['payment'],
                'price': order['price'],
                'time': {
                    'from': {
                        'hours': int(start.hour),
                        'minutes': int(start.minute)
                    },
                    'until': {
                        'hours': int(finish.hour),
                        'minutes': int(finish.minute)
                    }
                }
            }

        if pc['status'] == 'techWorks':
            cur_pc['details'] = {
                'reason': pc['description']
            }

        reponseArray.append(cur_pc)

    return reponseArray


def play(time, price, pc_id, payment_type):
    db = SQLiteDB('pc')
    status = get_status(pc_id)
    if status == 'online':
        hours = time.hours
        minutes = time.minutes
        now = datetime.now()
        start = now.strftime(DATE_FORMAT_DEFAULT)
        finish = (now + timedelta(hours=int(hours), minutes=int(minutes))).strftime(DATE_FORMAT_DEFAULT)
        pc_session_id = str(uuid4())
        db.execute_update_query('insert into orders(uuid,pc_id,start,finish,price,payment) values(?,?,?,?,?,?)', [ pc_session_id, pc_id, start, finish, price, payment_type ])
        db.execute_update_query("update pcs set status='playing' where id=?", [ pc_id ])
        return pc_session_id
    else:
        raise Exception("PC Status is not online")


def pause(pc_id):
    status = get_status(pc_id)
    if status == 'playing':
        db = SQLiteDB('pc')
        db.execute_update_query('update pcs set status=? where id=?', [ 'pause', pc_id ])
    else:
        raise Exception("PC is not in playing status")


def continue_play(pc_id):
    status = get_status(pc_id)
    if status == 'pause':            
        db = SQLiteDB('pc')
        
        order = db.execute_select_query('select * from orders where pc_id=? order by id desc limit 1', [ pc_id ])[0]

        start_time = datetime.strptime(order['start'], DATE_FORMAT_DEFAULT)
        finish_old = datetime.strptime(order['finish'], DATE_FORMAT_DEFAULT)

        now = datetime.now()
        delta = now - start_time
        total_seconds = delta.total_seconds()

        finish_new = (finish_old + delta).strftime(DATE_FORMAT_DEFAULT)

        hours = int(total_seconds // 3600)
        minutes = int((total_seconds % 3600) // 60)
        pause = f'h:{hours};m:{minutes}'
        
        session_id = order['id']
        db.execute_update_query('update orders set pause=?, finish=? where id=?', [ pause, finish_new, session_id ])
        db.execute_update_query('update pcs set status=? where id=?', [ 'playing', pc_id ])
    else:
        raise Exception("PC is not in playing status")


def finish(pc_id, price=None, payment=None):
    status = get_status(pc_id)
    if status == 'playing':
        db = SQLiteDB('pc')
        db.execute_update_query("update pcs set status='online' where id=?", [ pc_id ])

        if payment != None or price != None:
            pc_session = db.execute_select_query('select uuid from orders where pc_id=? order by id desc limit 1', [ pc_id ])[0]['uuid']

        if payment != None:
            db.execute_update_query('update orders set payment=? where uuid=?', [ payment, pc_session ])

        if price != None:
            current_session = db.execute_select_query('select * from orders where uuid=?', [pc_session])[0]
            now = datetime.now()
            finish_time = datetime.strptime(current_session['finish'], DATE_FORMAT_DEFAULT)

            real_finish = now.strftime(DATE_FORMAT_DEFAULT)

            if now >= finish_time:
                new_uuid = str(uuid4())
                if payment != None:
                    new_payment = payment
                else:
                    new_payment = current_session['payment']
                new_price = price - float(current_session['price'])
                db.execute_update_query('insert into orders (uuid, pc_id, start, finish, price, payment) values(?,?,?,?,?,?)', 
                                        [new_uuid, pc_id, current_session['finish'], real_finish, new_price, new_payment])
                pass

            if now <= finish_time:
                db.execute_update_query('update orders set finish=?, price=? where uuid=?', [ real_finish, price, pc_session ])

    else:
        raise Exception("PC Status is not playing")
    

def start_tech_works(pc_id, reason):
    db = SQLiteDB('pc')
    db.execute_update_query('update pcs set status=?, description=? where id=?', [ 'techWorks', reason, pc_id ])


def stop_tech_works(pc_id):
    db = SQLiteDB('pc')
    db.execute_update_query('update pcs set status=?, description=null where id=?', [ 'online', pc_id ])


def get_status(pc_id):
    db = SQLiteDB('pc')
    status = db.execute_select_query('select status from pcs where id=?', [ pc_id ])
    return status[0]['status']


def set_grid_id(pc_id, grid_id):
    db = SQLiteDB('pc')
    db.execute_update_query('update pcs set grid_id=? where id=?', [ grid_id, pc_id ])


def set_pc_name(pc_id, name):
    db = SQLiteDB('pc')
    db.execute_update_query('update pcs set name=? where id=?', [ name, pc_id ])


def remove_pc(pc_id):
    db = SQLiteDB('pc')
    db.execute_update_query('delete from pcs where id=?', [ pc_id ])
