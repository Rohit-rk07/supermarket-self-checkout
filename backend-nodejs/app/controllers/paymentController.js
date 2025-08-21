import Razorpay from 'razorpay';
import crypto from 'crypto';
import logger from '../utils/logger.js';

// NOTE: Do NOT initialize Razorpay at module load time, because dotenv may not
// be configured yet when this file is imported. Instead, create the client
// inside the handler using the current environment variables.

// Create Razorpay order
export const createOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    // Validate Razorpay credentials
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET || 
        process.env.RAZORPAY_KEY_ID.includes('YOUR_TEST_KEY') ||
        process.env.RAZORPAY_KEY_SECRET.includes('YOUR_SECRET_KEY')) {
      logger.error('Invalid Razorpay credentials', { 
        keyId: process.env.RAZORPAY_KEY_ID?.substring(0, 10) + '...',
        hasSecret: !!process.env.RAZORPAY_KEY_SECRET 
      });
      return res.status(500).json({
        success: false,
        error: 'Payment service not configured',
        details: 'Please configure valid Razorpay credentials'
      });
    }

    // Basic amount validations
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      logger.error('Invalid amount received for Razorpay order', { amount });
      return res.status(400).json({
        success: false,
        error: 'Invalid amount',
        details: 'Amount must be a positive number in rupees'
      });
    }

    const amountInPaise = Math.round(amount * 100);

    const orderData = {
      amount: amountInPaise,
      currency,
    };
    
    if (receipt) orderData.receipt = receipt;
    if (notes) orderData.notes = notes;
    
    logger.info('Creating Razorpay order', { amount: amountInPaise, currency, receipt });
    
    // Initialize Razorpay client with current env vars
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    try {
      const order = await razorpay.orders.create(orderData);
      logger.info('Razorpay order created successfully', { orderId: order.id, amount: order.amount });
      
      res.json({
        orderId: order.id,
        amount: order.amount / 100,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID
      });
    } catch (razorpayError) {
      logger.error('Razorpay API error details', { 
        error: razorpayError.message,
        statusCode: razorpayError.statusCode,
        description: razorpayError.error?.description,
        code: razorpayError.error?.code,
        field: razorpayError.error?.field,
        source: razorpayError.error?.source,
        step: razorpayError.error?.step,
        reason: razorpayError.error?.reason,
        metadata: razorpayError.error?.metadata,
        orderData
      });
      // Ensure visibility in console even if logger meta is compact
      console.error('Razorpay error raw:', JSON.stringify({
        message: razorpayError.message,
        statusCode: razorpayError.statusCode,
        error: razorpayError.error
      }, null, 2));
      throw razorpayError; // Re-throw to trigger general error handler
    }
  } catch (error) {
    logger.error('Error creating Razorpay order', { error });
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
      logger.error('Invalid payment signature', { 
        expectedSignature, 
        receivedSignature: razorpay_signature 
      });
      res.status(400).json({ 
        error: "Payment verification failed",
        details: "Invalid signature" 
      });
    }
  } catch (error) {
    logger.error('Error verifying payment signature', { error });
    next(error);
  }
};
