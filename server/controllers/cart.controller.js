import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

// DRY
const removeProductFromUserCart = (user, productId) => {
  user.cartItems = user.cartItems.filter(
    (item) => item.product.toString() !== productId
  );
};

//////////
export const addToCart = catchAsync(async (req, res, next) => {
  const { productId } = req.body;
  const user = req.user;

  // Check if product already exists in cart
  const itemExisted = user.cartItems.find(
    (item) => item.product.toString() === productId.toString()
  );
  if (itemExisted) {
    itemExisted.quantity += 1;
  } else {
    // Add new item to cart
    user.cartItems.push({ product: productId, quantity: 1 });
  }

  // update the user
  await user.save();

  res.status(201).json({ status: "success", cart: user.cartItems });
});

// remove all quantity of specific product
export const deleteAllFromCart = catchAsync(async (req, res, next) => {
  const { productId } = req.body;
  const user = req.user;

  removeProductFromUserCart(user, productId);

  // update the user
  await user.save();

  res.status(200).json({ status: "success", cart: user.cartItems });
});

export const updateQuantity = catchAsync(async (req, res, next) => {
  const { id: productId } = req.params;
  const { quantity } = req.body;
  const user = req.user;
  const itemExisted = user.cartItems.find((item) => item.product === productId);

  if (!itemExisted) {
    return next(new AppError("Product not found", 404));
  }

  if (quantity === 0) {
    // so remove it
    removeProductFromUserCart(user, productId);
  } else {
    // just update the quantity
    itemExisted.quantity = quantity;
  }

  // update the user
  await user.save();

  res.status(200).json({ status: "success", cart: user.cartItems });
});

export const getCartProducts = catchAsync(async (req, res, next) => {
  const user = await req.user.populate({
    path: "cartItems.product",
    select: "name price image",
  });

  res.status(200).json({ status: "success", cart: user.cartItems });
});
