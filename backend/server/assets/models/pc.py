from pydantic import BaseModel, Field, validator

class Time(BaseModel):
    hours: int = Field(description="Количество часов")
    minutes: int = Field(description="Количество минут")

    @validator('minutes')
    def validator_minutes(cls, value):
        if int(value) > 59:
            raise ValueError("Max minutes is 59")
        else:
            return value


class Play(BaseModel):
    id: int = Field(description="ID девайса")
    price: float = Field(description="Цена услуги")
    time: Time = Field(description="Игровое время")
    payment: str = Field(description="Метод оплаты<br>cash/card")

    @validator('price')
    def validate_price(cls, value):
        if float(value) <= 0:
            raise ValueError("Price must be greater then 0")
        return value

    @validator("payment")
    def validate_payment_type(cls, value):
        if value not in {"cash", "card"}:
            raise ValueError("Payment type must be 'cash' or 'card'")
        return value


class Finish(BaseModel):
    id: int = Field(description="ID девайса")
    # pc_session: str = Field(description="ID Сессии")
    price: float = Field(None, description="Новая цена, если она отличается от старой")
    payment: str = Field(None, description="Оплата, если изменился метод оплаты")

    @validator("payment")
    def validate_payment_type(cls, value):
        if value not in {"cash", "card"}:
            raise ValueError("Payment type must be 'cash' or 'card'")
        return value

class DetailsTime(BaseModel):
    From: Time = Field(description="Время начала оказания услуги")
    Until: Time = Field(description="Предпологаемое время окончания услуги")


class StartTechWorks(BaseModel):
    id: int = Field(description="ID девайса")
    reason: str = Field(description="Причина")


class GridId(BaseModel):
    id: int = Field(description="ID девайса")
    grid_id: int = Field(description="Новый GridID")


class EditName(BaseModel):
    id: int = Field(description="ID девайса")
    name: str = Field(description="Новое имя девайса")


class Details(BaseModel):
    price: float = Field(description="Цена услуги")
    time: DetailsTime = Field(description="Временные рамки оказания услуги")
    reason: str = Field(description="Описание причин")
    payment: str = Field(description="Метод оплаты")


class ResponsePing(BaseModel):
    id: int = Field(description="PC ID")
    name: str = Field(description="PC name")
    status: str = Field(description="PC status")
    grid_id: int = Field(description="Grid ID")
    details: Details = Field(None, description="Информация о текущей услуге")


class StartPcPlay(BaseModel):
    pc_session: str = Field(description="ID сессии")