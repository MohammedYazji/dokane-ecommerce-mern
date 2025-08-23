import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";

// init express app and read environment variables
dotenv.config({ path: "./.env" });
const app = express();
const PORT = process.env.PORT || 3000;

// middlewares

// allow us to parse the body from request as json
app.use(express.json());
// allow us to parse cookie from request
app.use(cookieParser());

// routes
app.use("/api/v1/auth", authRoutes);

// run the server
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectDB();
});
