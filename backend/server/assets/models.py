from pydantic import BaseModel


class Time(BaseModel):
    hours: int
    minutes: int


class Play(BaseModel):
    id: int
    price: float
    time: Time


class Finish(BaseModel):
    id: int
    price: float = None