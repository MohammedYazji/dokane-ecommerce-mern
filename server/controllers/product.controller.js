import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import client from "../lib/redis.js";
import Product from "../models/product.model.js";

export const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({});

  res.status(200).json({ status: "success", products });
});

export const getFeaturedProducts = catchAsync(async (req, res, next) => {
  // 1) try to get them from redis as cache for faster access
  let featured_products = await client.get("featured_products");
  if (featured_products) {
    // parse the string to json because redis store data as string
    return res.status(200).json({
      status: "success",
      featured_products: JSON.parse(featured_products),
    });
  }

  // 2) if not in redis get them from mongo
  featured_products = await Product.find({ isFeatured: true }).lean(); // use lean to return js object instead of mongodb object [better performance]

  if (!featured_products) {
    return next("No featured products found", 404);
  }

  // 3) store in redis for future quick access
  // store them as string agin
  await client.set("featured_products", JSON.stringify(featured_products));

  return res.status(200).json({
    status: "success",
    featured_products: JSON.parse(featured_products),
  });
});
