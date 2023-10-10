import uvicorn
from fastapi import FastAPI
from routers import pc, store, stat, workflow
from fastapi.middleware.cors import CORSMiddleware
import os


def init_log_folder():
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
    init_log_folder()
    uvicorn.run("main:app", host="127.0.0.1", port=8000, log_level="info", log_config='./log.ini')
