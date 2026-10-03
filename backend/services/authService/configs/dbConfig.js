import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_ATLAS_URI, {});
    console.log("Connected to MongoDB Atlas successfully");
  } catch (err) {
    console.log("Error connecting to MongoDB:", err);
  }
};