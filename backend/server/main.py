import uvicorn
from fastapi import FastAPI
from routers import pc
from routers import store
from routers import stat
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(pc.router, prefix="/pc", tags=["pc"])
app.include_router(store.router, prefix="/store", tags=["store"])
app.include_router(stat.router, prefix="/stat", tags=["stat"])


if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8000)