#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ENV_FILE = '.env';

// Generate a secure JWT secret
const generateJWTSecret = () => {
    return crypto.randomBytes(64).toString('hex');
};

// Check if .env file exists and validate required variables
const validateEnvironment = () => {
    if (!fs.existsSync(ENV_FILE)) {
        console.log('❌ .env file not found');
        return false;
    }

    const envContent = fs.readFileSync(ENV_FILE, 'utf8');
    const requiredVars = [
        'JWT_SECRET',
        'MONGODB_URI',
        'PORT',
        'NODE_ENV'
    ];

    const missingVars = [];
    const weakVars = [];

    requiredVars.forEach(varName => {
        const regex = new RegExp(`^${varName}=(.*)$`, 'm');
        const match = envContent.match(regex);
        
        if (!match || !match[1] || match[1].trim() === '') {
            missingVars.push(varName);
        } else if (varName === 'JWT_SECRET' && match[1].length < 32) {
            weakVars.push(varName);
        }
    });

    if (missingVars.length > 0) {
        console.log('❌ Missing required environment variables:', missingVars.join(', '));
        return false;
    }

    if (weakVars.length > 0) {
        console.log('⚠️  Weak environment variables:', weakVars.join(', '));
        return false;
    }

    return true;
};

// Setup environment file
const setupEnvironment = () => {
    console.log('🔧 Setting up environment configuration...\n');

    if (fs.existsSync(ENV_FILE)) {
        console.log('📄 .env file already exists');
        
        if (validateEnvironment()) {
            console.log('✅ Environment configuration is valid');
            return;
        }
        
        console.log('🔄 Updating environment configuration...');
    } else {
        console.log('📝 Creating new .env file...');
    }

    const jwtSecret = generateJWTSecret();
    
    const envTemplate = `# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/supermarket-checkout

# JWT Configuration - SECURE RANDOM SECRET
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=7d

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email Configuration (Optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Twilio SMS Configuration (Optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Logging Configuration
LOG_LEVEL=INFO
LOG_TO_FILE=true
`;

    fs.writeFileSync(ENV_FILE, envTemplate);
    console.log('✅ Environment file created successfully');
    console.log('🔐 Generated secure JWT secret');
    
    console.log('\n📋 Next steps:');
    console.log('1. Update MONGODB_URI if using a different database');
    console.log('2. Add your Razorpay credentials for payments');
    console.log('3. Configure Twilio credentials for SMS (optional)');
    console.log('4. Update EMAIL_USER and EMAIL_PASS for email features (optional)');
};

// Main execution
const main = () => {
    console.log('🚀 Supermarket Checkout - Environment Setup\n');
    
    try {
        setupEnvironment();
        
        console.log('\n🎉 Setup completed successfully!');
        console.log('💡 You can now start the server with: npm run dev');
        
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        process.exit(1);
    }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { validateEnvironment, generateJWTSecret };
