from fastapi import APIRouter, Depends, Header
from starlette.responses import JSONResponse
from assets.modules import stat
from assets.models import stat as model
from assets.modules.auth import auth, auth_admin


router = APIRouter()


@router.post('/session', dependencies=[Depends(auth)], response_model=model.SessionStatResponse)
def get_stat(data: model.StatDates, sessionId: str = Header(description="Session ID")):
    """ 
    Получить статистику 
    <br>
    Если параметр Start не отправляется, то статистика считается с начал текущей смены
    <br>
    Если параметр From не отправляется, то статистика считается до текущего времени
    <br>
    Если нужно посмотреть статистику не за смену, то в запросе нужно указать пароль администратора
    """
    try:
        if data.From or data.Until:
            if not auth_admin(data.Password):
                return JSONResponse(content='Unauthorized', status_code=401)
        stat_data = stat.get_stat(sessionId, data.From, data.Until)
        return JSONResponse(content=stat_data, status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)
    

@router.get('/prices', dependencies=[Depends(auth)], response_model=list[int])
def get_popular_prices():
    """ Получить популярные цена на бронь """
    try:
        arr = stat.get_popular_prices()
        return JSONResponse(content=arr, status_code=200)
    except Exception as e:
        return JSONResponse(content='', status_code=400)


@router.post('/expense', dependencies=[Depends(auth)])
def add_expense(data: model.ExpenseRequest, authorization: str = Header(description="UUID Пользователя")):
    """ Добавить расход """
    try:
        stat.add_expense(data.amount, data.reason, authorization)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        return JSONResponse(content='', status_code=400)
