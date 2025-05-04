# backend/app/razorpay.py
import razorpay
import json
from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from typing import Optional
import os

router = APIRouter()

# Initialize Razorpay client
# In production, use environment variables for these keys
RAZORPAY_KEY_ID = os.environ.get("RAZORPAY_KEY_ID", "rzp_test_YOUR_TEST_KEY")
RAZORPAY_KEY_SECRET = os.environ.get("RAZORPAY_KEY_SECRET", "YOUR_SECRET_KEY")

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

class OrderRequest(BaseModel):
    amount: float
    currency: str = "INR"
    receipt: Optional[str] = None
    notes: Optional[dict] = None

class PaymentVerificationRequest(BaseModel):
    razorpay_payment_id: str
    razorpay_order_id: str
    razorpay_signature: str

@router.post("/create-order")
async def create_order(order_request: OrderRequest):
    try:
        # Convert amount to paise (Razorpay expects amount in smallest currency unit)
        amount_in_paise = int(order_request.amount * 100)
        
        # Create order
        data = {
            "amount": amount_in_paise,
            "currency": order_request.currency,
        }
        
        if order_request.receipt:
            data["receipt"] = order_request.receipt
            
        if order_request.notes:
            data["notes"] = order_request.notes
            
        order = client.order.create(data=data)
        
        return {
            "orderId": order["id"],
            "amount": order["amount"] / 100,  # Convert back to decimal currency
            "currency": order["currency"],
            "key": RAZORPAY_KEY_ID
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify-payment")
async def verify_payment(verification: PaymentVerificationRequest):
    try:
        # Verify the payment signature
        params_dict = {
            'razorpay_order_id': verification.razorpay_order_id,
            'razorpay_payment_id': verification.razorpay_payment_id,
            'razorpay_signature': verification.razorpay_signature
        }
        
        # Verify signature
        client.utility.verify_payment_signature(params_dict)
        
        # If verification is successful, you can update your database
        # and mark the order as paid
        
        return {"status": "success", "message": "Payment verified successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Payment verification failed")