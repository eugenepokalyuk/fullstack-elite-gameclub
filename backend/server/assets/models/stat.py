from pydantic import BaseModel, Field, validator
from datetime import datetime


class StatDates(BaseModel):
    From: datetime = Field(None, description="С какого времени")
    Until: datetime = Field(None, description="По какое время")
    Password: str = Field(None, description="Пароль администратора для просмотра более широкой статистики")


class StoreStatItem(BaseModel):
    id: int = Field(description="ID продажи")
    qty: int = Field(description="Количество позиций в продаже")
    total: float = Field(description="Сумма продажи")
    payment: float = Field(description="Тип оплаты")
    item_id: int = Field(description="ID Позиции")
    name: int = Field(description="Название позиции")
    uuid: int = Field(description="ID Заказа")
    date: str = Field(description="Время продажи")


class DeviceStatItem(BaseModel):
    id: int = Field(description="ID Продажи")
    pc_id: int = Field(description="ID Девайса")
    price: float = Field(description="Цена услуги")
    payment: float = Field(description="Тип оплаты")
    name: str = Field(description="Имя девайса")


class WriteOffTypeStat(BaseModel):
    qty: int = Field(description="Количество списанных позиций")
    price: float = Field(description="Сумма списанных позиций")


class WriteOffStat(BaseModel):
    person: WriteOffTypeStat = Field(None, description="Списания на персонал")
    exp: WriteOffTypeStat = Field(None, description="Списания на порчу")


class SupplyStat(BaseModel):
    item_id: int = Field(description="ID позиции")
    qty: int = Field(description="Количество позиций на приход")


class ExpenseRequest(BaseModel):
    amount: float = Field(description="Сумма расхода")
    reason: str = Field(description="Причина")
    
    @validator('amount')
    def validate_amount(value):
        if value <= 0:
            raise ValueError("Amount must be greater then 0")
        return value
    

class ExpenseStat(BaseModel):
    amount: float = Field(description="Сумма расхода")
    reason: str = Field(description="Причина")
    

class SessionStatResponse(BaseModel):
    storefront: list[StoreStatItem]
    devices: list[DeviceStatItem]
    canceled: int = Field(description="Количество отмененных бронирований")
    supplies: list[SupplyStat]
    writeoff: WriteOffStat = Field(description="Списания")
    session_start: str = Field(None, description="Время начала смены")
    expenses: list[ExpenseStat]
