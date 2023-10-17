from fastapi import APIRouter, Depends, Header, Response, Request, Cookie
from fastapi.encoders import jsonable_encoder
from starlette.responses import JSONResponse
from assets.models import workflow as models
from assets.modules import workflow
from assets.modules.auth import auth


router = APIRouter()


@router.post('/create', response_model=models.CreateUserResponse)
def create_user(data: models.CreateUser):
    """ Создать пользователя """
    try:
        uuid = workflow.create_user(data)
        return JSONResponse(content={'uuid':uuid}, status_code=200)
    except Exception as e:
        return JSONResponse(content='', status_code=400)


@router.post('/login', response_model=models.LoginResponse)
def login_user(data: models.LoginUser):
    """ Авторизация пользователя по логину и паролю"""
    try:
        user_data = workflow.login_user(data)
        success = user_data != None
        response = {'success':success}
        if success:
            session_id = workflow.start_session(user_data['uuid'])
            response['sessionId'] = session_id
            response['uuid'] = user_data['uuid']
            response['name'] = user_data['name']
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        return JSONResponse(content='', status_code=400)


@router.get('/auth', response_model=models.AuthResponse, dependencies=[Depends(auth)])
def auth_user(authorization: str = Header(description="UUID Пользователя")):
    """ Авторизация по UUID """
    try:
        name = workflow.get_name_by_uuid(authorization)
        return JSONResponse(content={'success':True, 'name':name}, status_code=200)
    except Exception as e:
        return JSONResponse(content={'success':False}, status_code=400)
    

@router.get('/finish', dependencies=[Depends(auth)])
def finish_session(sessionId: str = Header(description="UUID Смены")):
    """ Завершить рабочую смену """
    try:
        workflow.finish_session(sessionId)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        return JSONResponse(content='', status_code=400)
    

@router.get('/all', dependencies=[Depends(auth)], response_model=list[models.UserDataResponse])
def get_list_of_users():
    """ Получить список пользователей """
    try:
        arr = workflow.get_all_users()
        return JSONResponse(content=arr, status_code=200)
    except Exception as e:
        return JSONResponse(content='', status_code=400)
    