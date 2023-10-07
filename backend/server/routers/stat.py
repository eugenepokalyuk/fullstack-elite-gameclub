from fastapi import APIRouter, Depends, Query
from fastapi.encoders import jsonable_encoder
from starlette.responses import JSONResponse
from assets.modules import stat


router = APIRouter()


@router.get('/')
def test():
    pass