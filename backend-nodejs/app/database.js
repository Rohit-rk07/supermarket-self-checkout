import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const DATABASE_URL = process.env.MONGODB_URI || "mongodb://localhost:27017/supermarket-checkout";
    await mongoose.connect(DATABASE_URL);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    console.log(`🧭 DB:   ${mongoose.connection.name}`);
    console.log('✅ MongoDB Connected Successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('💡 Make sure MongoDB is running on your system');
    console.log('💡 Try: mongod --dbpath C:\\data\\db');
    // Don't exit in development, let the app continue
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected');
});

export default connectDB;
