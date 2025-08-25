import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import Coupon from "../models/coupon.model.js";

export const getCoupon = catchAsync(async (req, res, next) => {
  const user = req.user;

  const coupon = await Coupon.findOne({ userId: user._id, isActive: true });

  res.status(200).json({
    status: "success",
    coupon: coupon || null,
  });
});

export const verifyCoupon = catchAsync(async (req, res, next) => {
  const { code } = req.body;
  const user = req.user;

  // 1) try to get the coupon of this user and compare it
  const coupon = await Coupon.findOne({ userId: user._id, isActive: true });

  if (!coupon || coupon.code !== code) {
    return next(new AppError("Coupon not found", 404));
  }

  // 2) check the expiration date too so make it inactive
  if (coupon.expirationDate < new Date()) {
    coupon.isActive = false;
    await coupon.save();
    return next(new AppError("Coupon expired", 400));
  }

  res.status(200).json({
    status: "success",
    message: "Coupon is valid",
    code: coupon.code,
    discountPercentage: coupon.discountPercentage,
  });
});
