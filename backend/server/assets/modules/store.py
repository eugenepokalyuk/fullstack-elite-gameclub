from .database import SQLiteDB
from datetime import *


# Получить список всех доступных продуктов
def get_all_items():
    db = SQLiteDB('store')
    data = db.execute_select_query('select * from storefront')
    for item in data:
        item['hide'] = item['hide'] == 1
    return data


# Добавить продукт
def create_product(name, price):
    db = SQLiteDB('store')
    db.execute_update_query('insert into storefront (name, qty, price, hide) values(?,?,?,?)', [ name, 0, price, 0 ])
    item_id = db.execute_select_query('select seq from sqlite_sequence where name="storefront"')[0]['seq']
    return item_id


# Получить данные о позиции
def get_item_info(item_id):
    db = SQLiteDB('store')
    data = db.execute_select_query('select * from storefront where id=?', [ item_id ])[0]
    data['hide'] = data['hide'] == 1
    return data


# Изменение имени продукта
def change_price(item_id, new_price):
    db = SQLiteDB('store')
    db.execute_update_query('update storefront set price=? where id=?', [ new_price, item_id ])


# Изменение цены продукта
def change_name(item_id, new_name):
    db = SQLiteDB('store')
    db.execute_update_query('update storefront set name=? where id=?', [ new_name, item_id ])


# Скрыть товар
def hide_item(item_id):
    db = SQLiteDB('store')
    db.execute_update_query('update storefront set hide=1 where id=?', [ item_id ])


# Показывать товар
def show_item(item_id):
    db = SQLiteDB('store')
    db.execute_update_query('update storefront set hide=0 where id=?', [ item_id ])


# Продажа
def sell_products(items_array, payment_type):
    db = SQLiteDB('store')
    products = db.execute_select_query('select * from storefront where qty > 0')
    warehouse = {item['id']: {'qty': int(item['qty']), 'price': float(item['price'])} for item in products}

    for item in items_array:
        i_id = item['id']
        i_qty = int(item['qty'])
        if i_id in warehouse and warehouse[i_id]['qty'] >= i_qty:
            pass
        else:
            raise Exception("Not enough products")

    now = datetime.now().strftime('%Y-%m-%d %H:%M')
    for item in items_array:
        new_qty = int(warehouse[item['id']]['qty']) - int(item['qty'])
        price = warehouse[item['id']]['price']
        total_sum = int(item['qty']) * price
        db.execute_update_query('insert into sold (item_id, qty, total, payment, sell_date) values(?,?,?,?,?)', 
                                [ item['id'], item['qty'], total_sum, payment_type, now ])
        db.execute_update_query('update storefront set qty=? where id=?', [ new_qty, item['id'] ])


# Поставка
def supply(items_array):
    db = SQLiteDB('store')
    products = db.execute_select_query('select * from storefront')
    warehouse = {item['id']: int(item['qty']) for item in products}

    now = datetime.now().strftime('%Y-%m-%d %H:%M')
    for item in items_array:
        old_qty = warehouse[item['id']]
        new_qty = old_qty + int(item['qty'])
        db.execute_update_query('insert into supplies (item_id, qty, add_date) values(?,?,?)', 
                                [ item['id'], item['qty'], now ])
        db.execute_update_query('update storefront set qty=? where id=?', [ new_qty, item['id'] ])
        