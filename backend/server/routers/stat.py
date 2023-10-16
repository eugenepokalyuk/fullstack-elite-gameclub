from fastapi import APIRouter, Depends, Header
from starlette.responses import JSONResponse
from assets.modules import stat
from assets.models import stat as model
from assets.modules.auth import auth


router = APIRouter()


@router.get('/session', dependencies=[Depends(auth)], response_model=model.SessionStatResponse)
def get_session_stat(sessionId: str = Header(description="Session ID")):
    """ Получить статистику текущей смены """
    try:
        data = stat.get_session_stat(sessionId)
        return JSONResponse(content=data, status_code=200)
    except Exception as e:
        return JSONResponse(content='', status_code=400)


# @router.post('/pc', response_model=list[model.GamingStatItem], dependencies=[Depends(auth)])
# def get_pc_stat(data: model.Stat):
#     """ Получить статистику по девайсам за промужуток времени """
#     try:
#         resp_data = stat.get_pc_stat(data.From, data.Until)
#         return JSONResponse(content=resp_data, status_code=200)
#     except Exception as e:
#         print(e)
#         return JSONResponse(content='', status_code=400)


# @router.post('/store', response_model=list[model.StoreStatItem], dependencies=[Depends(auth)])
# def get_store_stat(data: model.Stat):
#     """ Получить статистику по магазину за промужуток времени """
#     try:
#         resp_data = stat.get_store_stat(data.From, data.Until)
#         return JSONResponse(content=resp_data, status_code=200)
#     except Exception as e:
#         print(e)
#         return JSONResponse(content='', status_code=400)
