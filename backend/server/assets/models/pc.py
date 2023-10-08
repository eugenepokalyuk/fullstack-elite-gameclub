from pydantic import BaseModel, Field, validator

class Time(BaseModel):
    hours: int = Field(description="Количество часов")
    minutes: int = Field(description="Количество минут")


class Play(BaseModel):
    id: int = Field(description="ID девайса")
    price: float = Field(description="Цена услуги")
    time: Time = Field(description="Игровое время")

    @validator('price')
    def validate_price(cls, value):
        if float(value) <= 0:
            raise ValueError("Price must be greater then 0")
        return value


class Finish(BaseModel):
    id: int = Field(description="ID девайса")
    price: float = Field(None, description="Новая цена, если она отличается от старой")


class DetailsTime(BaseModel):
    From: Time = Field(description="Время начала оказания услуги")
    Until: Time = Field(description="Предпологаемое время окончания услуги")


class Details(BaseModel):
    price: float = Field(description="Цена услуги")
    time: DetailsTime = Field(description="Временные рамки оказания услуги")
    reason: str = Field(description="Описание причин")


class StartTechWorks(BaseModel):
    id: int = Field(description="ID девайса")
    reason: str = Field(description="Причина")


class ResponsePing(BaseModel):
    id: int = Field(description="PC ID")
    name: str = Field(description="PC name")
    status: str = Field(description="PC status")
    grid_id: int = Field(description="Grid ID")
    details: Details = Field(None, description="Информация о текущей услуге")
