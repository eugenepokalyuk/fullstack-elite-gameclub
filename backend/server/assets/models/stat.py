from pydantic import BaseModel, Field, validator
from datetime import datetime

class Stat(BaseModel):
    From: datetime = Field(description="С какого времени")
    Until: datetime = Field(description="По какое время")


class Response(BaseModel):
    pass
