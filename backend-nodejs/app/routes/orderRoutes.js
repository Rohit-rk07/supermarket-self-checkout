import express from 'express';
import { 
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  getOrderStats
} from '../controllers/orderController.js';
import { authenticateJWT, authorize } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import Joi from 'joi';

const router = express.Router();

// Validation schemas
const createOrderSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      barcode: Joi.string().required(),
      quantity: Joi.number().integer().min(1).default(1)
    })
  ).min(1).required(),
  notes: Joi.string().max(500).optional(),
  deliveryAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().default('India')
  }).optional()
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'processing', 'completed', 'cancelled', 'refunded').optional(),
  paymentStatus: Joi.string().valid('pending', 'paid', 'failed', 'refunded').optional()
});

// Routes
router.post('/', authenticateJWT, validateRequest(createOrderSchema), createOrder);
router.get('/my-orders', authenticateJWT, getUserOrders);
router.get('/stats', authenticateJWT, authorize('admin', 'staff'), getOrderStats);
router.get('/all', authenticateJWT, authorize('admin', 'staff'), getAllOrders);
router.get('/:orderId', authenticateJWT, getOrderById);
router.put('/:orderId/status', authenticateJWT, authorize('admin', 'staff'), validateRequest(updateOrderStatusSchema), updateOrderStatus);
router.put('/:orderId/cancel', authenticateJWT, cancelOrder);

export default router;
