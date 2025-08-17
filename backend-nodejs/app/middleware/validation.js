import Joi from 'joi';

// Product validation schema
export const productSchema = Joi.object({
  barcode: Joi.string().required().min(8).max(20),
  name: Joi.string().required().min(1).max(100),
  price: Joi.number().required().min(0).max(10000)
});

// Razorpay order validation schema
export const orderSchema = Joi.object({
  amount: Joi.number().required().min(0.01),
  currency: Joi.string().default('INR'),
  receipt: Joi.string().optional(),
  notes: Joi.object().optional()
});

// Payment verification schema
export const paymentVerificationSchema = Joi.object({
  razorpay_payment_id: Joi.string().required(),
  razorpay_order_id: Joi.string().required(),
  razorpay_signature: Joi.string().required()
});

// Validation middleware
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    next();
  };
};
