import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "order must have a user related with it"],
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "order must have a product related with it"],
        },
        quantity: {
          type: Number,
          required: [true, "order must have a quantity of product"],
          min: 0,
        },
        price: {
          type: Number,
          required: [true, "order must have a price of product"],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, "order must have a total numbers of products"],
      min: 0,
    },
    stripeSessionId: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
