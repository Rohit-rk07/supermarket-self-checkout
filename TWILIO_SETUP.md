# Twilio SMS Setup Guide for OTP Authentication

## Overview
This guide explains how to set up Twilio for SMS-based OTP authentication in your supermarket checkout application.

## Option 1: Twilio Trial Account (Recommended for Testing)

### Step 1: Create Twilio Account
1. Go to [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Sign up for a free trial account
3. Verify your email and phone number

### Step 2: Get Your Credentials
1. After signup, you'll be redirected to the Twilio Console
2. Find these credentials on your dashboard:
   - **Account SID**: Starts with "AC..."
   - **Auth Token**: Click the eye icon to reveal it
   - **Trial Phone Number**: Provided automatically (starts with +1...)

### Step 3: Configure Environment Variables
Update your `backend-nodejs/.env` file:
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

### Step 4: Trial Account Limitations
- **Free Credits**: $15 USD trial credit
- **Verified Numbers Only**: Can only send SMS to phone numbers you've verified in Twilio Console
- **Twilio Branding**: Messages include "Sent from your Twilio trial account"

### Step 5: Add Verified Phone Numbers
1. In Twilio Console, go to **Phone Numbers** > **Manage** > **Verified Caller IDs**
2. Click **Add a new number**
3. Enter your phone number (with country code, e.g., +919876543210)
4. Verify via SMS or voice call
5. Use this verified number for testing

## Option 2: Alternative Testing Methods

### Method A: Use Your Own Phone Number
- Add your personal phone number as a verified caller ID in Twilio
- Test the OTP flow with your own number
- Format: `+[country_code][phone_number]` (e.g., +919876543210 for India)

### Method B: Development Mode (No SMS)
The app is already configured to work without Twilio:
- OTP will be logged to backend console
- Check terminal output for the 6-digit code
- Use this code in the frontend

### Method C: Twilio Phone Number Lookup
1. Go to **Phone Numbers** > **Manage** > **Buy a number**
2. Search for numbers in your country
3. Purchase a number (requires paid account)

## Country Code Examples
- **India**: +91
- **United States**: +1
- **United Kingdom**: +44
- **Canada**: +1
- **Australia**: +61
- **Germany**: +49

## Testing the OTP Flow

### 1. Start the Application
```bash
# Backend
cd backend-nodejs
npm start

# Frontend (new terminal)
cd frontend
npm run dev
```

### 2. Test Login Flow
1. Open http://localhost:5173
2. Select country code from dropdown
3. Enter phone number (must be verified in Twilio for trial accounts)
4. Click "Send OTP"
5. Check SMS or backend console for OTP
6. Enter OTP and verify

### 3. Expected Behavior
- **With Twilio configured**: SMS sent to phone
- **Without Twilio**: OTP logged to console
- **Development mode**: OTP shown in API response

## Troubleshooting

### Common Issues
1. **"Invalid phone number format"**
   - Ensure number includes country code (+91, +1, etc.)
   - No spaces or special characters except +

2. **"SMS not received"**
   - Check if number is verified in Twilio Console
   - Verify Twilio credentials in .env file
   - Check backend logs for errors

3. **"Twilio authentication failed"**
   - Double-check Account SID and Auth Token
   - Ensure no extra spaces in .env file

### Backend Logs
Monitor these logs in your terminal:
```
✅ SMS sent successfully to +919876543210
📱 SMS to +919876543210: Your Smart Checkout OTP is: 123456. Valid for 10 minutes.
💡 To enable real SMS, configure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env
```

## Production Setup

### Upgrade to Paid Account
1. Add payment method to Twilio account
2. Remove trial limitations
3. Send SMS to any valid phone number
4. Remove "trial account" branding from messages

### Security Best Practices
1. Use environment variables for credentials
2. Never commit .env files to version control
3. Rotate Auth Tokens regularly
4. Monitor usage and costs
5. Implement rate limiting for OTP requests

## Cost Information
- **Trial**: $15 free credit
- **SMS Cost**: ~$0.0075 per SMS (varies by country)
- **Phone Number**: ~$1/month for US numbers

## Support
- Twilio Documentation: https://www.twilio.com/docs
- Twilio Console: https://console.twilio.com
- Support: https://support.twilio.com
