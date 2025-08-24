import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "product must have a name"],
    },
    description: {
      type: String,
      required: [true, "product must have a description"],
    },
    price: {
      type: Number,
      min: 0,
      required: [true, "product must have a price"],
    },
    image: {
      type: String,
      required: [true, "product must have an image"],
    },
    category: {
      type: String,
      required: [true, "product must have a category"],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
