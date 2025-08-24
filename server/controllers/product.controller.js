import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import Product from "../models/product.model.js";

export const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({});

  res.status(200).json({ status: "success", products });
});
