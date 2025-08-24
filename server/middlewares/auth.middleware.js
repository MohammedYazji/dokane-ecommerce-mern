import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import User from "../models/user.model.js";

export const protectRoute = catchAsync(async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return next(new AppError("Unauthorized - No access token provided", 401));
  }

  const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY);

  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    return next(new AppError("User not found", 404));
  }
  req.user = user;
  next();
});

export const adminRoute = catchAsync(async (req, res, next) => {
  if (req.user && req.user.role === "admin") next();
  else next(new AppError("Access denied - Admin only", 403));
});
