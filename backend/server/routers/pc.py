from fastapi import APIRouter, Depends, Query
from fastapi.encoders import jsonable_encoder
from starlette.responses import JSONResponse
from assets.models import pc as models
from assets.modules import pc


router = APIRouter()


@router.get("/ping", response_model=list[models.ResponsePing])
def ping():
    """
    Получить сведения о всех компьютерах
    """
    try:
        data = pc.get_pc_data()
        return JSONResponse(content=data, status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)
    

@router.patch("/play")
def play(data: models.Play):
    """
    Начать игровое время компьютера
    """
    try:
        pc.play(data.time, data.price, data.id)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)


@router.patch("/pause")
def pause(id: int = Query(description="ID девайса")):
    """
    Поставть на паузу игровое время
    """
    try:
        pc.pause(id)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)


@router.patch("/continue")
def continue_play(id: int = Query(description="ID девайса")):
    """
    Продолжить игровое время
    """
    try:
        pc.continue_play(id)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)


@router.patch("/finish")
def finish(data: models.Finish):
    """
    Закончить игровое время
    """
    try:
        pc.finish(data.id, data.price)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)


@router.patch('/techworks/start')
def start_tech_works(data: models.StartTechWorks):
    """
    Объявить о технических работах
    """
    try:
        pc.start_tech_works(data.id, data.reason)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)


@router.patch('/techworks/stop')
def stop_tech_works(id: int = Query(description="ID девайса")):
    """
    Завершить технические работы
    """
    try:
        pc.stop_tech_works(id)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)
    

@router.patch('/edit/name')
def edit_pc_name(data: models.EditName):
    """ 
    Изменить имя девайса
    """
    try:
        pc.set_pc_name(data.id, data.name)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)
    

@router.patch('/edit/grid')
def set_grid_id_for_pc(data: models.GridId):
    """
    Изменить местоположение ПК
    """
    try:
        pc.set_grid_id(data.id, data.grid_id)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)
    
@router.delete('/remove')
def remove_device(id: int = Query(description="ID Удаляемого девайса")):
    """
    Удалить девайс
    """
    try:
        pc.remove_pc(id)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)