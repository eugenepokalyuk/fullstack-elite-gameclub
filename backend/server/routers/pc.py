from fastapi import APIRouter, Depends, Query
from starlette.responses import JSONResponse
from sqlalchemy.orm import Session
from assets.models import pc as models
from assets.modules import pc
from assets.modules.auth import auth



router = APIRouter()


@router.get("/ping", response_model=list[models.ResponsePing], dependencies=[Depends(auth)])
def ping():
    """ Получить сведения о всех компьютерах """
    try:
        data = pc.get_pc_data()
        return JSONResponse(content=data, status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)
    

@router.patch("/play", dependencies=[Depends(auth)], response_model=models.StartPcPlay)
def play(data: models.Play):
    """ Начать игровое время компьютера """
    try:
        pc_session = pc.play(data.time, data.price, data.id, data.payment)
        return JSONResponse(content={'pc_session':pc_session}, status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)


@router.patch("/pause", dependencies=[Depends(auth)])
def pause(id: int = Query(description="ID девайса")):
    """ Поставть на паузу игровое время """
    try:
        pc.pause(id)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)


@router.patch("/continue", dependencies=[Depends(auth)])
def continue_play(id: int = Query(description="ID девайса")):
    """ Продолжить игровое время """
    try:
        pc.continue_play(id)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)


@router.patch("/finish", dependencies=[Depends(auth)])
def finish(data: models.Finish):
    """ Закончить игровое время """
    try:
        pc.finish(data.id, data.price, data.payment)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)


@router.patch('/techworks/start', dependencies=[Depends(auth)])
def start_tech_works(data: models.StartTechWorks):
    """ Объявить о технических работах """
    try:
        pc.start_tech_works(data.id, data.reason)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)


@router.patch('/techworks/stop', dependencies=[Depends(auth)])
def stop_tech_works(id: int = Query(description="ID девайса")):
    """ Завершить технические работы """
    try:
        pc.stop_tech_works(id)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)
    

@router.patch('/edit/name', dependencies=[Depends(auth)])
def edit_pc_name(data: models.EditName):
    """ Изменить имя девайса """
    try:
        pc.set_pc_name(data.id, data.name)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)
    

@router.patch('/edit/grid', dependencies=[Depends(auth)])
def set_grid_id_for_pc(data: models.GridId):
    """ Изменить местоположение ПК """
    try:
        pc.set_grid_id(data.id, data.grid_id)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)
    
@router.delete('/remove', dependencies=[Depends(auth)])
def remove_device(id: int = Query(description="ID Удаляемого девайса")):
    """ Удалить девайс """
    try:
        pc.remove_pc(id)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)