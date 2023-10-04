from .database import SQLiteDB
from datetime import *

def get_pc_data():
    db = SQLiteDB()
    data = db.execute_select_query('select id as "_id", status, name from pcs')

    for pc in data:
        if pc['status'] == 'playing':
            order = db.execute_select_query('select * from orders where pc_id=? order by id desc limit 1', [pc['_id']])[0]
            pc['price'] = order['price']
            start = datetime.strptime(order['start'], '%Y-%m-%d %H:%M')
            finish = datetime.strptime(order['finish'], '%Y-%m-%d %H:%M')
            pc['time'] = {
                'from': {
                    'hours': int(start.strftime('%H')),
                    'minutes': int(start.strftime('%M'))
                },
                'until': {
                    'hours': int(finish.strftime('%H')),
                    'minutes': int(finish.strftime('%M'))
                }
            }
            # pause = datetime.strptime(pc['pause'], '%y-%m-%d %H:%M')
    return data


def play(time, price, pc_id):
    db = SQLiteDB()
    status = get_status(pc_id)
    if status == 'online':
        hours = time['hours']
        minutes = time['minutes']
        now = datetime.now()
        start = now.strftime('%Y-%m-%d %H:%M')
        finish = (now + timedelta(hours=int(hours), minutes=int(minutes))).strftime('%Y-%m-%d %H:%M')
        db.execute_update_query('insert into orders(pc_id,start,finish,price) values(?,?,?,?)', [ pc_id, start, finish, price ])
        db.execute_update_query("update pcs set status='playing' where id=?", [ pc_id ])
    else:
        raise Exception("PC Status is not online")


def pause(pc_id):
    status = get_status(pc_id)
    if status == 'playing':
        db = SQLiteDB()
        db.execute_update_query('update pcs set status=? where id=?', [ 'pause', pc_id ])
    else:
        raise Exception("PC is not in playing status")


def continue_play(pc_id):
    status = get_status(pc_id)
    if status == 'pause':            
        db = SQLiteDB()
        order = db.execute_select_query('select * from orders where pc_id=? order by id desc limit 1', [ pc_id ])[0]

        start_time = datetime.strptime(order['start'], '%Y-%m-%d %H:%M')
        finish_old = datetime.strptime(order['finish'], '%Y-%m-%d %H:%M')

        now = datetime.now()
        delta = now - start_time
        finish_new = (finish_old + delta).strftime('%Y-%m-%d %H:%M')

        hours = delta.days * 24 + delta.seconds // 3600
        minutes = (delta % 3600) // 60
        pause = f'h:{hours};m:{minutes}'
        
        session_id = order['id']
        db.execute_update_query('update orders set pause=?, finish=? where id=?', [ pause, finish_new, session_id ])
    else:
        raise Exception("PC is not in playing status")


def finish(pc_id, price=None):
    db = SQLiteDB()
    status = get_status(pc_id)
    if status == 'playing':
        db.execute_update_query("update pcs set status='online' where id=?", [ pc_id ])
        if price != None:
            session_id = db.execute_select_query('select id from orders where pc_id=? order by id DESC limit 1')[0]['id']
            db.execute_update_query('update orders set price=? where id=?', [ price, session_id ])
    else:
        raise Exception("PC Status is not playing")
    

def get_status(pc_id):
    db = SQLiteDB()
    status = db.execute_select_query('select status from pcs where id=?', [ pc_id ])
    return status[0]['status']