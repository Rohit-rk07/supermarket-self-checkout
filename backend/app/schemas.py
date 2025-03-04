from pydantic import BaseModel

class ProductBase(BaseModel):
    barcode: str
    name: str
    price: float

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    class Config:
        orm_mode = True
