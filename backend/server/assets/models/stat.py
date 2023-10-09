from pydantic import BaseModel, Field, validator
from datetime import datetime


class Stat(BaseModel):
    From: datetime = Field(description="С какого времени")
    Until: datetime = Field(description="По какое время")


class StoreStatItem(BaseModel):
    count: int = Field(description="Количество проданной позиции")
    total: float = Field(description="Общая сумма продаж по позиции")
    item_id: int = Field(description="ID Позиции")


class GamingStatItem(BaseModel):
    id: int = Field(description="")