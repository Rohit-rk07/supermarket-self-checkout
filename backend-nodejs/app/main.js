import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './database.js';
import productRoutes from './routes/productRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import logger, { httpLogger } from './utils/logger.js';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    logger.error('Missing required environment variables', { missingEnvVars });
    process.exit(1);
}

// Connect to MongoDB
connectDB();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    details: 'Please try again later'
  }
});
app.use(limiter);

// CORS middleware
const defaultOrigins = ['http://localhost:5173'];
const envOrigins = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "demo-token", "Accept", "X-Requested-With"]
}));

// HTTP request logging
// Explicitly handle CORS preflight for all routes
app.options('*', cors());

app.use(httpLogger);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/v1/scan', productRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/orders', orderRoutes);

// Auth routes (matching frontend expectations)
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: "Supermarket Checkout API Running!",
    version: "2.0.0",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: "Supermarket Checkout API",
    version: "2.0.0",
    endpoints: {
      products: {
        "GET /api/v1/scan/:barcode": "Get product by barcode",
        "GET /api/v1/products": "Get all products",
        "POST /api/v1/products": "Create new product",
        "PUT /api/v1/products/:barcode": "Update product",
        "DELETE /api/v1/products/:barcode": "Delete product"
      },
      auth: {
        "POST /api/auth/phone/send-otp": "Send OTP to phone",
        "POST /api/auth/phone/verify-otp": "Verify OTP",
        "POST /api/auth/complete-registration": "Complete user registration",
        "GET /api/auth/profile": "Get user profile",
        "PUT /api/auth/profile": "Update user profile"
      },
      payments: {
        "POST /api/v1/payments/create-order": "Create Razorpay order",
        "POST /api/v1/payments/verify-payment": "Verify payment"
      },
      orders: {
        "GET /api/v1/orders": "Get user orders",
        "POST /api/v1/orders": "Create new order",
        "GET /api/v1/orders/:id": "Get order by ID"
      }
    }
  });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info('Server started successfully', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    apiDocs: `http://localhost:${PORT}/api`,
    healthCheck: `http://localhost:${PORT}/`
  });
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API docs available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check at http://localhost:${PORT}/`);
});
