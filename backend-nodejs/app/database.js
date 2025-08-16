import mongoose from 'mongoose';

const DATABASE_URL = process.env.MONGODB_URI || "mongodb://localhost:27017/supermarket-checkout";

const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
