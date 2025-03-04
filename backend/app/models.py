from .database import Base
from sqlalchemy import Column,String, Float


class Product(Base):
    __tablename__ = "products"
    
   
    barcode = Column(String, primary_key=True, unique=True, index=True)
    name = Column(String, nullable=False, index=True)
    price = Column(Float, nullable=False)
