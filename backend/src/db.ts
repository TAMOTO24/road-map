import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.DATABASE_URL!;

mongoose.connect(dbUrl)
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err: String) => {
  console.error("MongoDB connection error:", err);
});