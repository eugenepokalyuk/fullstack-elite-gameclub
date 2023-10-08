from fastapi import APIRouter, Depends, Query
from starlette.responses import JSONResponse
from assets.modules import stat
from assets.models import stat as model


router = APIRouter()


@router.post('/pc')
def get_pc_stat(data: model.Stat):
    try:
        resp_data = stat.get_pc_stat(data.From, data.Until)
        return JSONResponse(content=resp_data, status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)


@router.post('/store')
def get_store_stat(data: model.Stat):
    try:
        resp_data = stat.get_store_stat(data.From, data.Until)
        return JSONResponse(content=resp_data, status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)
