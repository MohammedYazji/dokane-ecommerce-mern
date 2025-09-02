import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import AppError from "./utils/appError.js";
import globalErrorHandler from "./middlewares/error.middleware.js";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

// 0) init express app and read environment variables
dotenv.config({ path: "./.env" });
const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 1) setup cors
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// 2) middlewares

// allow us to parse the body from request as json
app.use(express.json({ limit: "10mb" }));
// allow us to parse cookie from request
app.use(cookieParser());


// 3) routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "..", "client", "dist");
  if (fs.existsSync(staticPath)) {
    app.use(express.static(staticPath));
    app.get(/^(?!\/api).*/, (req, res) => {
      res.sendFile(path.join(staticPath, "index.html"));
    });
  } else {
    app.get("*", (req, res) =>
      res.status(500).json({ error: "Frontend not built" })
    );
  }
} else {
  app.get("/", (req, res) => {
    res.json({ message: "API is running in development mode" });
  });
}

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
