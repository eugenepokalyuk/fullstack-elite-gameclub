from fastapi import APIRouter, Depends, Query, Request
from starlette.responses import JSONResponse
from assets.models import pc as models
from assets.modules import pc
from assets.modules.auth import auth



router = APIRouter()


@router.get('/init')
def init_pc( request: Request, name: str = Query(description="Имя устройства")):
    pc_ip = request.client.host
    print(pc_ip)


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
        return JSONResponse(content='', status_code=400)


@router.patch("/pause", dependencies=[Depends(auth)])
def pause(id: int = Query(description="ID девайса")):
    """ Поставть на паузу игровое время """
    try:
        pc.pause(id)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        return JSONResponse(content='', status_code=400)


@router.patch("/continue", dependencies=[Depends(auth)])
def continue_play(id: int = Query(description="ID девайса")):
    """ Продолжить игровое время """
    try:
        pc.continue_play(id)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        return JSONResponse(content='', status_code=400)
    

@router.patch("/swap", dependencies=[Depends(auth)])
def swap_order_pc_id(data: models.PcSwap):
    """ Пересадить пользователя за другой девайс """
    try:
        pc.swap(data.id, data.new_id)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        return JSONResponse(content='', status_code=400)


@router.patch("/cancel", dependencies=[Depends(auth)])
def cancel(id: int = Query(description="ID девайса")):
    """ Отменить бронирование """
    try:
        pc.cancel(id)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        return JSONResponse(content='', status_code=400)


@router.patch("/finish", dependencies=[Depends(auth)])
def finish(data: models.Finish):
    """ Закончить игровое время """
    try:
        pc.finish(data.id, data.price, data.payment)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        return JSONResponse(content='', status_code=400)


@router.patch('/techworks/start', dependencies=[Depends(auth)])
def start_tech_works(data: models.StartTechWorks):
    """ Объявить о технических работах """
    try:
        pc.start_tech_works(data.id, data.reason)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        return JSONResponse(content='', status_code=400)


@router.patch('/techworks/stop', dependencies=[Depends(auth)])
def stop_tech_works(id: int = Query(description="ID девайса")):
    """ Завершить технические работы """
    try:
        pc.stop_tech_works(id)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        return JSONResponse(content='', status_code=400)
    

@router.patch('/edit/name', dependencies=[Depends(auth)])
def edit_pc_name(data: models.EditName):
    """ Изменить имя девайса """
    try:
        pc.set_pc_name(data.id, data.name)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        return JSONResponse(content='', status_code=400)
    

@router.patch('/edit/grid', dependencies=[Depends(auth)])
def set_grid_id_for_pc(data: models.GridId):
    """ Изменить местоположение ПК """
    try:
        pc.set_grid_id(data.id, data.grid_id)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        return JSONResponse(content='', status_code=400)
    

@router.patch('/edit/ip', dependencies=[Depends(auth)])
def edit_pc_ip(data: models.PcIP):
    """ Изменить местоположение ПК """
    try:
        pc.set_pc_ip(data.id, data.ip)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        return JSONResponse(content='', status_code=400)
   

@router.delete('/remove', dependencies=[Depends(auth)])
def remove_device(id: int = Query(description="ID Удаляемого девайса")):
    """ Удалить девайс """
    try:
        pc.remove_pc(id)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        return JSONResponse(content='', status_code=400)
    

@router.get('/block', dependencies=[Depends(auth)])
def block_pc_display_with_msg(text: str = Query(description="Текст для отображения на экране"), id: int = Query(description="ID Девайса для блокировки")):
    """ Заблокировать экран, клавиатуру и показать текст """
    try:
        pc.block_pc(id, text)
        return JSONResponse(content='Success', status_code=200)
    except Exception:
        return JSONResponse(content='Failed', status_code=400)


@router.get('/unblock', dependencies=[Depends(auth)])
def unblock_pc_display(id: int = Query(description="ID Девайса для разблокировки")):
    """ Разблокировать дисплей и клавиатуру """
    try:
        pc.unblock_pc(id)
        return JSONResponse(content='Success', status_code=200)
    except Exception:
        return JSONResponse(content='Failed', status_code=400)
    

@router.get('/notification', dependencies=[Depends(auth)])
def send_notification_to_pc(id: int = Query(description="ID девайса для уведомления"), text: str = Query(description="Текст уведомления")):
    """ Отправить уведомление на игровой девайс """
    try:
        pc.notification(id, text)
    except Exception:
        return JSONResponse(content='Failed', status_code=400)
