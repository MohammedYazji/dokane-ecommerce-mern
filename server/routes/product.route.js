import express from "express";
import upload from "../middlewares/multer.middleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getRecommendedProducts,
  toggleFeatured,
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// admin-only
router.get("/", protectRoute, adminRoute, getAllProducts);
router.post(
  "/",
  protectRoute,
  adminRoute,
  upload.single("image"),
  createProduct
);
router.put("/:id", protectRoute, adminRoute, toggleFeatured);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

// public
router.get("/featured", getFeaturedProducts);
router.get("/recommendations", getRecommendedProducts);
router.get("/category/:cat", getProductsByCategory);

export default router;
