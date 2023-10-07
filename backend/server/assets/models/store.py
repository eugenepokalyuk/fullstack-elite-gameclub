from pydantic import BaseModel, Field, validator


class ProductList(BaseModel):
    id: int = Field(description="ID Позиции")
    name: str = Field(description="Название позиции")
    qty: int = Field(description="Остаток позиций на складе")
    price: float = Field(description="Цена за одну единицу позиции")
    hide: bool = Field(description="Скрыт ли товар")


class ProductInfo(BaseModel):
    id: int = Field(description="ID позиции")
    name: str = Field(description="Название позиции")
    price: float = Field(description="Цена за одну единицу позиции")
    qty: int = Field(description="Остаток товара на складе")
    hide: bool = Field(description="Скрыт ли товар")


class CreateProduct(BaseModel):
    name: str = Field(description="Название позиции")
    price: float = Field(description="Цена за одну единицу позиции<br>Должна быть больше 0")

    @validator('price')
    def validate_price(cls, value):
        if float(value) <= 0:
            raise ValueError("Price must be greater then 0")
        return value


class SellProduct(BaseModel):
    id: int = Field(description="ID продоваемой позиции")
    qty: int = Field(description="Количество позиций")

    @validator('qty')
    def validator_qty(cls, value):
        if int(value) <= 0:
            raise ValueError("Qty must be greater then 0")
        return value
    

class SellProducts(BaseModel):
    items: list[SellProduct] = Field(description="Массив продаваемых позиций")
    payment: str = Field(description="Тип оплаты (cash/card)")

    @validator("payment")
    def validate_payment_type(cls, value):
        if value not in {"cash", "card"}:
            raise ValueError("Payment type must be 'cash' or 'card'")
        return value
    

class SupplyProduct(BaseModel):
    id: int = Field(description="ID позиции на приход")
    qty: int = Field(description="Количество позиций")


class SupplyProducts(BaseModel):
    items: list[SupplyProduct] = Field(description="Массив позиций на поставку")


class EditItemPrice(BaseModel):
    id: int = Field(description="ID позиции")
    price: float = Field(description="Новое значение цены")

    @validator('price')
    def validate_price(cls, value):
        if float(value) <= 0:
            raise ValueError("Price must be greater then 0")
        return value
    

class EditItemName(BaseModel):
    id: int = Field(description="ID позиции")
    name: str = Field(description="Новое название позиции")


class ResponseNewItem(BaseModel):
    id: int = Field(description="ID новой позиции")
