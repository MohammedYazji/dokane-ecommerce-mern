import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";

// init express app and read environment variables
dotenv.config({ path: "./.env" });
const app = express();
const PORT = process.env.PORT || 3000;

// run the server
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectDB();
});
