from fastapi import APIRouter, Depends, Header
from starlette.responses import JSONResponse
from assets.modules import stat
from assets.models import stat as model
from assets.modules.auth import auth


router = APIRouter()


@router.post('/session', dependencies=[Depends(auth)], response_model=model.SessionStatResponse)
def get_stat(body: model.StatDates, sessionId: str = Header(description="Session ID")):
    """ 
    Получить статистику 
    <br>
    Если параметр Start не отправляется, то статистика считается с начал текущей смены
    <br>
    Если параметр From не отправляется, то статистика считается до текущего времени
    """
    try:
        data = stat.get_stat(sessionId, body.From, body.Until)
        return JSONResponse(content=data, status_code=200)
    except Exception as e:
        return JSONResponse(content='', status_code=400)
    

@router.get('/prices', dependencies=[Depends(auth)], response_model=list[int])
def get_popular_prices():
    """ Получить популярные цена на бронь """
    try:
        arr = stat.get_popular_prices()
        return JSONResponse(content=arr, status_code=200)
    except Exception as e:
        return JSONResponse(content='', status_code=400)
