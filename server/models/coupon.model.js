import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "coupon must have a code"],
      unique: true,
    },
    discountPercentage: {
      type: Number,
      required: [true, "coupon must have a discount percentage"],
      min: 0,
      max: 100,
    },
    expirationDate: {
      type: Date,
      required: [true, "coupon must have an expiration date"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "coupon must have a user related to it"],
      unique: true,
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
