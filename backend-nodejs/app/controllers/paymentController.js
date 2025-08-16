import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_YOUR_TEST_KEY",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "YOUR_SECRET_KEY"
});

// Create Razorpay order
export const createOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;
    
    const amountInPaise = Math.round(amount * 100);
    
    const orderData = {
      amount: amountInPaise,
      currency,
    };
    
    if (receipt) orderData.receipt = receipt;
    if (notes) orderData.notes = notes;
    
    const order = await razorpay.orders.create(orderData);
    
    res.json({
      orderId: order.id,
      amount: order.amount / 100,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    next(error);
  }
};

// Verify payment signature
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.json({ 
        status: "success", 
        message: "Payment verified successfully" 
      });
    } else {
      res.status(400).json({ 
        error: "Payment verification failed",
        details: "Invalid signature" 
      });
    }
  } catch (error) {
    next(error);
  }
};
