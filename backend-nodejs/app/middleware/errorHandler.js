// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

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
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.stack : 'Something went wrong'
  });
};

// 404 handler
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    details: `Cannot ${req.method} ${req.path}`
  });
};
