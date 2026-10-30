import mongoose from 'mongoose';

/**
 * Connect to MongoDB instance using Mongoose.
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/carbon_coach';
  
  try {
    const conn = await mongoose.connect(uri);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    // In production/development, allow graceful handling or exit
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};
