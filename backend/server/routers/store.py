from fastapi import APIRouter, Depends, Query
from fastapi.encoders import jsonable_encoder
from starlette.responses import JSONResponse
from assets.models import store as models
from assets.modules import store


router = APIRouter()


@router.get('/items', response_model=list[models.ProductList])
def get_all_items():
    """
    Получить список всех доступных позиций склада
    """
    try:
        data = store.get_all_items()
        return JSONResponse(content=data, status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)
    

@router.get('/info', response_model=models.ProductInfo)
def item_info(id: int = Query(description="ID позиции")):
    """
    Информация об одной позиции
    """
    try:
        data = store.get_item_info(id)
        return JSONResponse(content=data, status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)
    

@router.post('/item/add', response_model=models.ResponseNewItem)
def add_item(data: models.CreateProduct):
    """
    Добавить новую позицию на склад
    """
    try:
        new_item_id = store.create_product(data.name, data.price)
        return JSONResponse(content={'id': new_item_id}, status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)
    

@router.patch('/item/edit/name')
def edit_item_name(data: models.EditItemName):
    """
    Изменить название
    """
    try:
        store.change_name(data.id, data.name)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)
    

@router.patch('/item/edit/price')
def edit_item_price(data: models.EditItemPrice):
    """
    Изменить цену
    """
    try:
        store.change_price(data.id, data.price)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)
    

@router.patch('/item/hide')
def hide_item(id: int = Query(description="ID позиции")):
    """
    Скрыть товар
    """
    try:
        store.hide_item(id)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)
    

@router.patch('/item/show')
def show_item(id: int = Query(description="ID позиции")):
    """
    Показывать товар
    """
    try:
        store.show_item(id)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)


@router.patch('/item/sell')
def sell_items(data: models.SellProducts):
    """
    Продажа позиций
    """
    try:
        store.sell_products(data.items, data.payment)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)



@router.put('/supply')
def supply(data: models.SupplyProducts):
    """
    Оформить поставку
    """
    try:
        store.supply(data.items)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)
