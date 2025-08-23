import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected Successfully to MongoDB`, conn.connection.host);
  } catch (error) {
    console.log("Database connection error: ", error.message);
    process.exit(1);
  }
};
