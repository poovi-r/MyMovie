import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected Successfully✅`);
  } catch (error) {
    console.error(`MongoDB connection failed ❌`);
    process.exit(1)
  }
};

export default connectDB;