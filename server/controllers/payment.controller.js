import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { stripe } from "../lib/stripe.js";

// create one-time inb stripe and return the couponID
async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });
  return coupon.id;
}

// create a coupon document in MONGODB
async function createNewCoupon(userId) {
  // first delete the previous one
  await Coupon.findOneAndDelete({ userId });
  // create a new coupon
  const newCoupon = new Coupon({
    // 1) generate a random coupon
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    // 2) set the coupon discount to  be 10
    discountPercentage: 10,
    // 3) and set the expiration date to be until 30 days
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // after 30 days
    // 4) link the coupon with user
    userId: userId,
  });

  // save the new coupon in to DB
  await newCoupon.save();

  return newCoupon;
}

// start the payment process and make the checkout page
export const createCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) read inputs
  // get the products and the coupon code from body
  const { products, couponCode } = req.body;
  // get the current user
  const user = req.user;

  // if now products raise an error
  if (!Array.isArray(products) || products.length == 0) {
    return next(new AppError("Invalid or empty products array", 400));
  }

  // 2) build stripe line items and compute total, to pass later when make the session

  let totalAmount = 0; // in cents

  // array will pass it to stripe
  // will be like => [{price_data:{}, quantity:}, {...}]
  const lineItems = products.map((p) => {
    const price = Number(p.product.price);
    const quantity = Number(p.quantity);
    // for each product convert amount to cents as stripe want
    const amount = Math.round(p.product.price * 100);
    // sum the total amount for all products
    totalAmount += amount * p.quantity;

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: p.product.name,
          images: [p.product.image],
        },
        unit_amount: amount,
      },
      quantity,
    };
  });

  // 3) apply the coupon and get the new total Amount
  // if a coupon code was provided, fetch it from your DB
  let coupon = null;
  if (couponCode) {
    // looks up a user-specific, active coupon in your MongoDB.
    coupon = await Coupon.findOne({
      code: couponCode,
      userId: req.user._id,
      isActive: true,
    });
    // if found, so reduce the totalAmount locally by the percentage
    if (coupon) {
      totalAmount -= Math.round(
        (totalAmount * coupon.discountPercentage) / 100
      );
    }
  }

  // 4) finally create the checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    // which we created before include the products info
    // What the user is paying for
    line_items: lineItems,
    mode: "payment",
    // Where to go when success
    success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
    // Where to go when cancel the process
    cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
    // if i found the coupon in DB soso create coupon in stripe with same discount
    discounts: coupon
      ? [
          {
            coupon: await createStripeCoupon(coupon.discountPercentage),
          },
        ]
      : [],
    // out some metadata to use it later when make the order
    // like userId, couponCode, products info
    metadata: {
      userId: req.user._id.toString(),
      couponCode: couponCode || "",
      products: JSON.stringify(
        products.map((p) => ({
          id: p.product._id,
          quantity: p.quantity,
          price: p.product.price,
        }))
      ),
    },
  });

  // 5) just make coupon if total amount > 200
  // if total amount larger than 200$ somake a new coupon locally and store in MONGODBs
  if (totalAmount >= 20000) {
    await createNewCoupon(req.user._id);
  }

  // 6) response to the client with the session id, and total amount in dollar
  res.status(200).json({
    status: "success",
    id: session.id,
    totalAmount: totalAmount / 100, // in dollar
  });
});

// process the success after payment
export const checkoutSuccess = catchAsync(async (req, res, next) => {
  // 1) read the session id from the body and get it from stripe
  const { sessionId } = req.body;
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  // 2) if not paid so the payment not successful
  if (session.payment_status !== "paid") {
    return next(new AppError("Payment not successful", 400));
  }

  // 3) if the coupon used when paid so deactivate it in MONGODB
  if (session.metadata.couponCode) {
    // get the coupon and make it inactive
    await Coupon.findOneAndUpdate(
      {
        code: session.metadata.couponCode,
        userId: session.metadata.userId,
      },
      {
        isActive: false,
      }
    );
  }

  // 4) create a new order

  // get the products from session metadata
  const products = JSON.parse(session.metadata.products);
  //   create a new order with these products
  const newOrder = new Order({
    user: session.metadata.userId,
    products: products.map((product) => ({
      product: product.id,
      quantity: product.quantity,
      price: product.price,
    })),
    // save the total amount in dollars again
    totalAmount: session.amount_total / 100, // in dollars
    // and store the session id of this order
    stripeSessionId: sessionId,
  });

  // save the order
  await newOrder.save();

  // Clear the user's cart after successful purchase
  const user = req.user;
  user.cartItems = [];
  await user.save();

  // return the new order id
  res.status(200).json({
    status: "success",
    message:
      "Payment successful, order created, cart cleared, and coupon deactivated if used",
    orderId: newOrder._id,
  });
});
