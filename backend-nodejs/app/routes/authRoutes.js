import express from 'express';
import { 
  loginWithFirebase, 
  registerWithEmail, 
  loginWithEmail,
  requestPasswordReset,
  resetPassword,
  sendOTP,
  verifyOTPAndResetPassword,
  getProfile,
  updateProfile
} from '../controllers/authController.js';
import { authenticateFirebase, authenticateJWT } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import Joi from 'joi';

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  displayName: Joi.string().min(2).max(50).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const resetRequestSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

const otpSchema = Joi.object({
  email: Joi.string().email().required()
});

const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  newPassword: Joi.string().min(6).required()
});

const updateProfileSchema = Joi.object({
  displayName: Joi.string().min(2).max(50).optional(),
  profile: Joi.object({
    phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).optional(),
    address: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      zipCode: Joi.string().optional(),
      country: Joi.string().optional()
    }).optional(),
    preferences: Joi.object({
      notifications: Joi.boolean().optional(),
      language: Joi.string().optional()
    }).optional()
  }).optional()
});

// Routes
router.post('/firebase/login', authenticateFirebase, loginWithFirebase);
router.post('/register', validateRequest(registerSchema), registerWithEmail);
router.post('/login', validateRequest(loginSchema), loginWithEmail);
router.post('/reset-password/request', validateRequest(resetRequestSchema), requestPasswordReset);
router.post('/reset-password', validateRequest(resetPasswordSchema), resetPassword);
router.post('/otp/send', validateRequest(otpSchema), sendOTP);
router.post('/otp/verify', validateRequest(verifyOtpSchema), verifyOTPAndResetPassword);
router.get('/profile', authenticateJWT, getProfile);
router.put('/profile', authenticateJWT, validateRequest(updateProfileSchema), updateProfile);

export default router;
