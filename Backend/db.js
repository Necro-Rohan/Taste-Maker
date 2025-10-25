import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error(
      "MongoDB connection error: MONGO_URI is not defined in .env file"
    );
    process.exit(1);
  }
  try {
    console.log("Attempting to connect to MongoDB..."); 
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);     // yeah db is connecting just fine 
    console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);   
  }
};

export default connectDB;