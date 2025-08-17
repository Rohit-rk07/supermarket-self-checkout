import User from '../models/User.js';
import { generateJWT } from '../middleware/auth.js';
import logger from '../utils/logger.js';

// Send OTP to phone number
export const sendPhoneOTP = async (req, res) => {
  try {
    console.log('🚀 Send OTP request started');
    console.log('📱 Request body:', req.body);
    
    const { phoneNumber } = req.body;
    console.log('📱 Phone number received:', phoneNumber);
    
    if (!phoneNumber) {
      console.log('❌ Phone number missing');
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Validate phone number format for top 6 countries
    const countryValidation = {
      '+1': { regex: /^\+1[2-9]\d{9}$/, name: 'US/Canada' },      // US/Canada: +1 + 10 digits
      '+91': { regex: /^\+91[6-9]\d{9}$/, name: 'India' },        // India: +91 + 10 digits (6-9)
      '+86': { regex: /^\+86[1]\d{10}$/, name: 'China' },         // China: +86 + 11 digits starting with 1
      '+44': { regex: /^\+44[7]\d{9}$/, name: 'UK' },             // UK: +44 + 10 digits starting with 7
      '+81': { regex: /^\+81[7-9]\d{8}$/, name: 'Japan' },        // Japan: +81 + 9 digits (7-9)
      '+49': { regex: /^\+49[1]\d{9,10}$/, name: 'Germany' }      // Germany: +49 + 10-11 digits starting with 1
    };

    let isValidPhone = false;
    let countryName = '';

    for (const [code, validation] of Object.entries(countryValidation)) {
      if (phoneNumber.startsWith(code) && validation.regex.test(phoneNumber)) {
        isValidPhone = true;
        countryName = validation.name;
        break;
      }
    }

    if (!isValidPhone) {
      console.log('❌ Invalid phone format:', phoneNumber);
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format. Supported countries: US/Canada (+1), India (+91), China (+86), UK (+44), Japan (+81), Germany (+49)'
      });
    }

    console.log('✅ Valid phone number for:', countryName);
    
    console.log('🔍 Looking for existing user with phone:', phoneNumber);
    // Check if user exists
    let user = await User.findOne({ phoneNumber });
    const isNewUser = !user;
    console.log('👤 User found:', !!user, 'isNewUser:', isNewUser);
    
    if (!user) {
      console.log('🆕 Creating new user...');
      // Create temporary user entry for OTP verification
      user = new User({
        phoneNumber,
        name: 'Temp User', // Will be updated after OTP verification
        isPhoneVerified: false
      });
      logger.authLog('NEW_USER_CREATED', null, { phoneNumber });
      console.log('✅ New user object created');
    }
    
    // Generate OTP
    console.log('🔢 Generating OTP...');
    const otp = user.generateOTP();
    console.log('✅ OTP generated:', otp);
    
    console.log('💾 Saving user to database...');
    try {
      await user.save();
      console.log('✅ User saved successfully');
    } catch (saveError) {
      console.log('❌ User save failed:', saveError.message);
      console.log('📋 Save error details:', saveError);
      logger.error('User save error during OTP generation', { 
        phoneNumber, 
        error: saveError.message,
        isNewUser 
      });
      return res.status(500).json({
        success: false,
        message: 'Failed to process OTP request'
      });
    }
    
    logger.authLog('OTP_GENERATED', user._id, { phoneNumber, isNewUser });
    
    // Send SMS using Twilio or other SMS service
    try {
      await sendSMS(phoneNumber, `Your Smart Checkout OTP is: ${otp}. Valid for 10 minutes.`);
      logger.info('OTP sent successfully', { phoneNumber });
    } catch (smsError) {
      logger.error('SMS sending failed', { phoneNumber, error: smsError.message });
      // For development, still allow the process to continue
      logger.warn('OTP fallback mode', { phoneNumber, otp: process.env.NODE_ENV === 'development' ? otp : '[HIDDEN]' });
    }
    
    // Always log OTP in development mode for easy testing
    if (process.env.NODE_ENV === 'development') {
      console.log(`\n🔐 OTP for ${phoneNumber}: ${otp}`);
      console.log(`⏰ Valid for 10 minutes\n`);
    }
    
    res.json({
      success: true,
      message: 'OTP sent to your phone number',
      // Show OTP in development mode for testing
      ...(process.env.NODE_ENV === 'development' && { otp })
    });
  } catch (error) {
    logger.error('Send phone OTP error', { phoneNumber: req.body.phoneNumber, error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
};

// SMS service function with Twilio integration
const sendSMS = async (phoneNumber, message) => {
  // Check if Twilio credentials are configured (not placeholder values)
  const hasValidTwilioConfig = 
    process.env.TWILIO_ACCOUNT_SID && 
    process.env.TWILIO_AUTH_TOKEN && 
    process.env.TWILIO_PHONE_NUMBER &&
    !process.env.TWILIO_ACCOUNT_SID.includes('your_twilio') &&
    !process.env.TWILIO_AUTH_TOKEN.includes('your_twilio') &&
    !process.env.TWILIO_PHONE_NUMBER.includes('your_twilio');
    
  if (hasValidTwilioConfig) {
    try {
      const twilio = await import('twilio');
      const client = twilio.default(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });
      
      console.log(`✅ SMS sent successfully to ${phoneNumber}`);
      return;
    } catch (error) {
      console.error('Twilio SMS error:', error);
      throw error;
    }
  }
  
  // Fallback for development/testing - this will always trigger with placeholder values
  console.log(`📱 Development Mode - SMS to ${phoneNumber}:`);
  console.log(`📄 Message: ${message}`);
  console.log('💡 To enable real SMS, configure valid Twilio credentials in .env');
  
  // Don't throw error in development mode
  if (process.env.NODE_ENV === 'development') {
    return; // Success in dev mode
  }
  
  throw new Error('SMS service not configured');
};

// Verify OTP and login/register
export const verifyPhoneOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      logger.authLog('OTP_VERIFY_FAILED', null, { phoneNumber, reason: 'user_not_found' });
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Verify OTP
    if (!user.verifyOTP(otp)) {
      logger.authLog('OTP_VERIFY_FAILED', user._id, { phoneNumber, reason: 'invalid_otp' });
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }
    
    // Mark phone as verified
    user.isPhoneVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    user.lastLogin = new Date();
    
    await user.save();
    
    // Generate JWT token
    const token = generateJWT(user._id);
    
    // Check if user needs to complete registration (only if name is missing or still default)
    const needsRegistration = !user.name || user.name === 'Temp User';
    
    logger.authLog('OTP_VERIFY_SUCCESS', user._id, { phoneNumber, needsRegistration });
    
    res.json({
      success: true,
      message: needsRegistration ? 'OTP verified. Complete registration.' : 'Login successful',
      data: {
        token,
        needsRegistration,
        isNewUser: needsRegistration,
        user: {
          _id: user._id,
          phoneNumber: user.phoneNumber,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    logger.error('OTP verification error', { phoneNumber: req.body.phoneNumber, error: error.message });
    res.status(500).json({
      success: false,
      message: 'OTP verification failed'
    });
  }
};

// Complete user registration after OTP verification
export const completeRegistration = async (req, res) => {
  try {
    console.log('🔍 Complete registration started');
    console.log('📝 Request body:', req.body);
    console.log('👤 User from JWT:', req.user ? { id: req.user._id, phone: req.user.phoneNumber } : 'No user');
    
    const { name, email } = req.body;
    const user = req.user; // From JWT middleware
    
    if (!user) {
      console.log('❌ No user found in request');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    if (!name) {
      console.log('❌ Name is missing');
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }
    
    console.log('🔄 Updating user details...');
    // Update user details
    user.name = name;
    if (email && email.trim() !== '') {
      user.email = email;
    }
    user.isNewUser = false; // Mark registration as completed
    
    console.log('💾 Saving user to database...');
    try {
      await user.save();
      console.log('✅ User saved successfully');
    } catch (saveError) {
      console.log('❌ Database save error:', saveError.message);
      console.log('📋 Error details:', saveError);
      throw saveError;
    }
    
    logger.authLog('REGISTRATION_COMPLETED', user._id, { name, email, phoneNumber: user.phoneNumber });
    
    res.json({
      success: true,
      message: 'Registration completed successfully',
      data: {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });
  } catch (error) {
    logger.error('Complete registration error', { 
      userId: req.user?._id, 
      error: error.message, 
      stack: error.stack,
      body: req.body 
    });
    res.status(500).json({
      success: false,
      message: 'Registration completion failed',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      success: true,
      data: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        email: user.email,
        role: user.role,
        isPhoneVerified: user.isPhoneVerified,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    logger.error('Get profile error', { userId: req.user?._id, error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const { name, email } = req.body;
    
    if (name) user.name = name;
    if (email) user.email = email;
    
    await user.save();
    
    logger.authLog('PROFILE_UPDATED', user._id, { name, email });
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error('Update profile error', { userId: req.user?._id, error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};
