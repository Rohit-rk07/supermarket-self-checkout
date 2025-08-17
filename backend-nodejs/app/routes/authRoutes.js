import express from 'express';
import { 
  sendPhoneOTP,
  verifyPhoneOTP,
  completeRegistration,
  getProfile,
  updateProfile
} from '../controllers/authController.js';
import { authenticateJWT } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import Joi from 'joi';

const router = express.Router();

// Validation schemas
const phoneOtpSchema = Joi.object({
  phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required().messages({
    'string.pattern.base': 'Please enter a valid phone number'
  })
});

const verifyOtpSchema = Joi.object({
  phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
  otp: Joi.string().length(6).required()
});

const completeRegistrationSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().allow('').optional()
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional()
});

// Phone-based authentication routes
router.post('/phone/send-otp', validateRequest(phoneOtpSchema), sendPhoneOTP);
router.post('/phone/verify-otp', validateRequest(verifyOtpSchema), verifyPhoneOTP);
router.post('/complete-registration', authenticateJWT, validateRequest(completeRegistrationSchema), completeRegistration);

// User profile routes
router.get('/profile', authenticateJWT, getProfile);
router.put('/profile', authenticateJWT, validateRequest(updateProfileSchema), updateProfile);

export default router;
