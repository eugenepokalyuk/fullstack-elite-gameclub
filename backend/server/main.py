import uvicorn
from fastapi import FastAPI
from routers import pc, store, stat, workflow
from fastapi.middleware.cors import CORSMiddleware
from assets.modules.database import create_default_devices
import os


def init_basic_folders():
    if not os.path.exists('./utils'):
        os.mkdir('./utils')
    if not os.path.exists('./logs'):
        os.mkdir('./logs')


app = FastAPI(title="Shell Backend", debug=True)


origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(pc.router, prefix="/pc", tags=["Computers"])
app.include_router(store.router, prefix="/store", tags=["Storefront"])
app.include_router(stat.router, prefix="/stat", tags=["Statistic"])
app.include_router(workflow.router, prefix="/user", tags=["User"])


if __name__ == '__main__':
    init_basic_folders()
    # create_default_devices()
    uvicorn.run("main:app", host="172.20.10.2", port=80, log_level="info")
    # uvicorn.run("main:app", host="127.0.0.1", port=8000, log_level="info")
    # 172.20.10.4
    # uvicorn.run("main:app", host="127.0.0.1", port=8000, log_level="info", log_config='./log.ini')
