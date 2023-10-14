from .workflow import DATE_FORMAT_DEFAULT
from .database import *
from datetime import datetime
from uuid import uuid4


# Получить список всех доступных продуктов
def get_all_items():
    db = Session()
    data = db.query(Storefront).all()
    items = []
    for row in data:
        items.append({
            'id': row.id,
            'hide': row.hide == 1,
            'name': row.name,
            'qty': row.qty,
            'price': float(row.price)
        })
    return items


# Добавить продукт
def create_product(name, price):
    db = Session()
    new_item = Storefront(name=name, qty=0, price=price, hide=0)
    db.add(new_item)
    db.commit()
    return new_item.id


# Получить данные о позиции
def get_item_info(item_id):
    db = Session()
    item = db.scalars(select(Storefront).where(Storefront.id == item_id)).one()
    return {
        'id': item.id,
        'hide': item.hide == 1,
        'name': item.name,
        'qty': item.qty,
        'price': float(item.price)
    }


# Изменение имени продукта
def change_price(item_id, new_price):
    db = Session()
    item = db.scalars(select(Storefront).where(Storefront.id == item_id)).one()
    item.price = new_price
    db.commit()


# Изменение цены продукта
def change_name(item_id, new_name):
    db = Session()
    item = db.scalars(select(Storefront).where(Storefront.id == item_id)).one()
    item.name = new_name
    db.commit()


# Скрыть товар
def hide_item(item_id):
    db = Session()
    item = db.scalars(select(Storefront).where(Storefront.id == item_id)).one()
    item.hide = 1
    db.commit()


# Показывать товар
def show_item(item_id):
    db = Session()
    item = db.scalars(select(Storefront).where(Storefront.id == item_id)).one()
    item.hide = 0
    db.commit()


# Продажа
def sell_products(items_array, payment_type):
    db = Session()
    products = db.query(Storefront).where(Storefront.qty > 0).all()
    warehouse = {item.id: {'qty': int(item.qty), 'price': float(item.price)} for item in products}

    for item in items_array:
        qty = int(item.qty)
        if item.id in warehouse and warehouse[item.id]['qty'] >= qty:
            pass
        else:
            raise Exception('Not enough products')
        
    sell_uuid = str(uuid4())
    now = datetime.now().strftime(DATE_FORMAT_DEFAULT)

    for item in items_array:
        new_qty = int(warehouse[item.id]['qty']) - int(item.qty)
        price = warehouse[item.id]['price']
        total_sum = int(item.qty) * price

        new_sell = Sold(uuid=sell_uuid, item_id=item.id, qty=item.qty, total=total_sum, payment=payment_type, sell_date=now)
        db.add(new_sell)

        item_db = db.scalars(select(Storefront).where(Storefront.id == item.id)).one()
        item_db.qty = new_qty
        
        db.commit()


# Поставка
def supply(items_array):
    db = Session()
    products = db.query(Storefront).all()
    warehouse = {item.id: int(item.qty) for item in products}
    now = datetime.now().strftime(DATE_FORMAT_DEFAULT)

    for item in items_array:
        old_qty = warehouse[item.id]
        new_qty = old_qty + int(item.qty)

        new_supply = Supplies(item_id=item.id, qty=item.qty, add_date=now)
        db.add(new_supply)

        item_db = db.scalars(select(Storefront).where(Storefront.id == item.id)).one()
        item_db.qty = new_qty

        db.commit()
        