from fastapi import APIRouter, Depends, Query
from starlette.responses import JSONResponse
from assets.modules import stat
from assets.models import stat as model


router = APIRouter()


@router.post('/pc', response_model=list[model.GamingStatItem])
def get_pc_stat(data: model.Stat):
    """ Получить статистику по девайсам за промужуток времени """
    try:
        resp_data = stat.get_pc_stat(data.From, data.Until)
        return JSONResponse(content=resp_data, status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)


@router.post('/store', response_model=list[model.StoreStatItem])
def get_store_stat(data: model.Stat):
    """ Получить статистику по магазину за промужуток времени """
    try:
        resp_data = stat.get_store_stat(data.From, data.Until)
        return JSONResponse(content=resp_data, status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)
