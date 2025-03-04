from sqlalchemy.orm import Session
from . import models

def get_product(db: Session, barcode: str):
    return db.query(models.Product).filter(models.Product.barcode == barcode).first()

def add_product(db: Session, barcode: str, name: str, price: float):
    new_product = models.Product(barcode=barcode, name=name, price=price)
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product
