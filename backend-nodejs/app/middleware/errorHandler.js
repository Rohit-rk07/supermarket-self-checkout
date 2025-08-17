import logger from '../utils/logger.js';

// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
  // Log the error with context
  logger.error('Request error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    userId: req.user?.id || 'anonymous',
    ip: req.ip || req.connection.remoteAddress
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: 'Validation Error',
      details: errors
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      error: 'Duplicate Error',
      details: `${field} already exists`
    });
  }

  // MongoDB connection error
  if (err.name === 'MongoNetworkError') {
    return res.status(503).json({
      error: 'Database Connection Error',
      details: 'Unable to connect to database'
    });
  }

  // Default error
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.stack : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
};

// 404 handler
export const notFoundHandler = (req, res) => {
  logger.warn('Route not found', {
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress
  });
  
  res.status(404).json({
    success: false,
    error: 'Route not found',
    details: `Cannot ${req.method} ${req.path}`,
    timestamp: new Date().toISOString()
  });
};
