import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import { client } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
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
    featured_products,
  });
});

export const createProduct = catchAsync(async (req, res, next) => {
  const { name, description, price, image, category } = req.body;

  let cloudinaryResponse = null;

  if (image) {
    cloudinaryResponse = await cloudinary.uploader.upload(image, {
      folder: "dokane_products",
    });
  }

  // create the product and save it
  const product = await Product.create({
    name,
    description,
    price,
    image: cloudinaryResponse?.secure_url ? cloudinaryResponse?.secure_url : "",
    category,
  });

  res.status(201).json({
    status: "success",
    product,
  });
});

export const deleteProduct = catchAsync(async (req, res, next) => {
  // get the product
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // if the product has image remove from cloudinary before delete the product from ongoDB
  if (product.image) {
    // EXAMPLE: https://res.cloudinary.com/demo/image/upload/v1698765432/dokane_products/abcd1234.png
    const publicId = product.image.split("/").pop().split(".")[0];
    try {
      await cloudinary.uploader.destroy(`dokane_products/${publicId}`);
      console.log("Deleted image from cloudinary");
    } catch (error) {
      console.log("error deleting image from cloudinary", error);
    }
  }

  // delete from mongoDB
  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
  });
});
