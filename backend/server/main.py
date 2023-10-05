from fastapi import FastAPI
from starlette.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from assets import models
from assets import computers


app = FastAPI()


@app.get("/ping")
def ping():
    try:
        data = computers.get_pc_data()
        return JSONResponse(content=data, status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)
    

@app.patch("/play")
def play(data: models.Play):
    try:
        json = jsonable_encoder(data)
        computers.play(json['time'], json['price'], json['id'])
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)


@app.patch("/pause")
def pause(id: int):
    try:
        computers.pause(id)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)


@app.patch("/continue")
def continue_play(id: int):
    try:
        computers.continue_play(id)
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)


@app.patch("/finish")
def finish(data: models.Finish):
    try:
        json = jsonable_encoder(data)
        computers.finish(json['id'],json['price'])
        return JSONResponse(content='', status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content='', status_code=400)