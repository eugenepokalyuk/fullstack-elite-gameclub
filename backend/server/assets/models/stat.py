from pydantic import BaseModel, Field, validator
from datetime import datetime


class Stat(BaseModel):
    From: datetime = Field(description="С какого времени")
    Until: datetime = Field(description="По какое время")


class StoreStatItem(BaseModel):
    id: int = Field(description="ID продажи")
    qty: int = Field(description="Количество позиций в продаже")
    total: float = Field(description="Сумма продажи")
    payment: float = Field(description="Тип оплаты")
    item_id: int = Field(description="ID Позиции")
    name: int = Field(description="Название позиции")
    uuid: int = Field(description="ID Заказа")


class DeviceStatItem(BaseModel):
    id: int = Field(description="ID Продажи")
    pc_id: int = Field(description="ID Девайса")
    price: float = Field(description="Цена услуги")
    payment: float = Field(description="Тип оплаты")
    name: str = Field(description="Имя девайса")


class SessionStatResponse(BaseModel):
    storefront: list[StoreStatItem]
    devices: list[DeviceStatItem]