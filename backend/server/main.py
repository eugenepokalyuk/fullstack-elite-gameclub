import uvicorn
from fastapi import FastAPI
from routers import pc
from routers import store
from routers import stat
from fastapi.middleware.cors import CORSMiddleware
# from fastapi_sqlalchemy import DBSessionMiddleware, db
# import assets.database.database as test_db

app = FastAPI()


origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
# app.add_middleware(DBSessionMiddleware, db_url=test_db.DATABASE_DEVICES, database_name="device")


app.include_router(pc.router, prefix="/pc", tags=["Computers"])
app.include_router(store.router, prefix="/store", tags=["Storefront"])
app.include_router(stat.router, prefix="/stat", tags=["Statistic"])


@app.get('/')
async def index():
    return []


if __name__ == '__main__':
    uvicorn.run("main:app", host="127.0.0.1", port=8000, log_level="info")
