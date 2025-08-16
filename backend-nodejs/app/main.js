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

// Load environment variables
dotenv.config();

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
app.use(cors({
  origin: ["http://localhost:5173", "https://supermarket-self-checkout-wheat.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/scan', productRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

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
        "GET /scan/:barcode": "Get product by barcode",
        "GET /products": "Get all products",
        "POST /products": "Create new product",
        "PUT /products/:barcode": "Update product",
        "DELETE /products/:barcode": "Delete product"
      },
      payments: {
        "POST /api/payments/create-order": "Create Razorpay order",
        "POST /api/payments/verify-payment": "Verify payment"
      }
    }
  });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API docs available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check at http://localhost:${PORT}/`);
});
