import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import AppError from "./utils/appError.js";
import globalErrorHandler from "./middlewares/error.middleware.js";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";

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
app.use("/api/v1/auth", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/payments", paymentRoutes);

// handle unhandled routes for all methods
// this will run if not catch in any route before
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// make a global error handling middleware
app.use(globalErrorHandler);

// 4) run the server
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectDB();
});
