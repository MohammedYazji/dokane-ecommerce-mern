import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    cartItems: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
      },
    ],
  },
  {
    timestamp: true,
  }
);

// user document middlewares

// hash password before saving it
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    console.log("error in hashing password", error);
  }
});

// compare password if is valid
userSchema.methods.isValidPassword = async function (password) {
  try {
    // Compare provided password with stored hash
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.log("Password comparison failed");
  }
};

// create user model and export it
const User = mongoose.model("User", userSchema);
export default User;
