import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";

// 1) init express app and read environment variables
dotenv.config({ path: "./.env" });
const app = express();
const PORT = process.env.PORT || 3000;

// 2) middlewares

// allow us to parse the body from request as json
app.use(express.json());
// allow us to parse cookie from request
app.use(cookieParser());

// 3) routes
app.use("/api/v1/auth", authRoutes);

// handle unhandled routes for all methods
// this will run if not catch in any route before
app.use((req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });

  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = "fail";
  err.statusCode = 404;
  next(err); // in express anything pass in next will consume as an error
});

// make a global error handling middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// 4) run the server
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectDB();
});
