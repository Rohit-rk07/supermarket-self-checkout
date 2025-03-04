from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, crud, database
from fastapi.middleware.cors import CORSMiddleware


models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/scan/{barcode}")  # Changed from POST to GET
def scan_item(barcode: str, db: Session = Depends(get_db)):
    product = crud.get_product(db, barcode)
    if not product:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"name": product.name, "price": product.price}

@app.get("/")
def home():
    return {"message": "Supermarket Checkout API Running!"}
