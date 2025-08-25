import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getCoupon, verifyCoupon } from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", protectRoute, getCoupon);
router.get("/validate", protectRoute, verifyCoupon);

export default router;
