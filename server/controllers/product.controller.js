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

  if (featured_products.length === 0) {
    return next(new AppError("No featured products found", 404));
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
  const { name, description, price, category } = req.body;

  if (!name || !description || !price || !category) {
    return next(new AppError("Missing required fields", 400));
  }

  if (!req.file) {
    return next(new AppError("Product image is required", 400));
  }

  let cloudinaryResponse;
  try {
    // Upload buffer directly to Cloudinary using upload_stream
    cloudinaryResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "dokane_products",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(new AppError('Failed to upload image to Cloudinary', 500));
          }
          resolve(result);
        }
      );
      
      // Handle stream errors
      uploadStream.on('error', (error) => {
        console.error('Stream error:', error);
        reject(new AppError('Error processing image upload', 500));
      });
      
      // Write the buffer to the stream
      uploadStream.end(req.file.buffer);
    });
  } catch (error) {
    console.error('Error in createProduct:', error);
    return next(error);
  }

  // create the product and save it
  const product = await Product.create({
    name,
    description,
    price: parseFloat(price),
    image: cloudinaryResponse.secure_url,
    public_id: cloudinaryResponse.public_id,
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

  if (product.public_id) {
    await cloudinary.uploader.destroy(product.public_id);
  }

  // delete from mongoDB
  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
  });
});

export const getRecommendedProducts = catchAsync(async (req, res, next) => {
  const products = await Product.aggregate([
    {
      $sample: { size: 3 },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        image: 1,
        price: 1,
        category: 1,
      },
    },
  ]);

  return res.status(200).json({
    status: "success",
    products,
  });
});

export const getProductsByCategory = catchAsync(async (req, res, next) => {
  const { cat } = req.params;

  const products = await Product.find({ category: cat });

  return res.status(200).json({
    status: "success",
    products,
  });
});

export const toggleFeatured = catchAsync(async (req, res, next) => {
  // 1) get the user
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // 2) toggle the featured status
  product.isFeatured = !product.isFeatured;

  // 3) then save the updated product
  const updatedProduct = await product.save();

  // 4) update the redis cache
  await updateFeaturedRedisCache();

  return res.status(200).json({
    status: "success",
    updatedProduct,
  });
});

async function updateFeaturedRedisCache() {
  const featuredProducts = await Product.find({ isFeatured: true }).lean();

  // update the featured products after get them from mongoDB
  await client.set("featured_products", JSON.stringify(featuredProducts));
}
