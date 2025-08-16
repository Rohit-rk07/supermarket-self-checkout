import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';
import { validateRequest, orderSchema, paymentVerificationSchema } from '../middleware/validation.js';

const router = express.Router();

// POST /api/payments/create-order
router.post('/create-order', validateRequest(orderSchema), createOrder);

// POST /api/payments/verify-payment
router.post('/verify-payment', validateRequest(paymentVerificationSchema), verifyPayment);

export default router;
