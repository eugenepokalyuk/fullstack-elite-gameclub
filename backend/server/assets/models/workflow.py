from pydantic import BaseModel, Field, validator


class CreateUser(BaseModel):
    name: str = Field(description="Имя пользователя")
    login: str = Field(description="Логин")
    password: str = Field(description="Пароль")


class CreateUserResponse(BaseModel):
    uuid: str = Field(description="User uuid")


class LoginUser(BaseModel):
    login: str = Field(description="Логин")
    password: str = Field(description="Пароль")


class LoginResponse(BaseModel):
    success: bool = Field(description="true/false")
    uuid: str = Field(description="UUID Пользователя")
    sessionId: str = Field(description="UUID Сессии")
    name: str = Field(description="Имя пользователя")


class AuthResponse(BaseModel):
    name: str = Field(description="Имя пользователя")