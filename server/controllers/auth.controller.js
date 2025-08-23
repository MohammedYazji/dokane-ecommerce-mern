import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { client } from "../lib/redis.js";

const generateTokens = async (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_SECRET_KEY, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  // set the token and set it to be valid until 7 days
  await client.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // prevent xss
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevent CSRF
    maxAge: 15 * 60 * 1000, // 15 min in ms
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });
};

/////////////////
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // check if user exist
    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return res
        .status(409)
        .json({ status: "fail", message: "User already exists" });
    }

    // create a new user
    const newUser = await User.create({
      name,
      email,
      password,
    });

    // make user authenticated
    // 1) generate tokens
    const { accessToken, refreshToken } = await generateTokens(newUser._id);
    // 2) store refreshToken in redis DB
    await storeRefreshToken(newUser._id, refreshToken);
    // 3) set cookies
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log("error in signup controller", error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // check if the user exist
    // if (!user) {
    //   res.status(404).json({ status: "fail", message: "user not found" });
    // }
    // check if password is the same in DB
    if (!user || !(await user.isValidPassword(password))) {
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid credentials" });
    }

    // authenticate the user

    // 1) generate tokens
    const { accessToken, refreshToken } = await generateTokens(user._id);

    // 2) store refresh token in redis
    storeRefreshToken(user._id, refreshToken);

    // 3) store tokens in cookies
    setCookies(res, accessToken, refreshToken);

    res.status(200).json({
      status: "success",
      message: "logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("error in login controller");
    res.status(500).json({ status: "fail", message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    // so if have refresh token so can logout
    if (refreshToken) {
      // 1) get the current user
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
      // 2) delete the refresh token from redis
      await client.del(`refresh_token:${decoded.userId}`);
      // 3) clear cookies
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(204).json({
        status: "success",
        message: "Logged out successfully",
      });
    }
  } catch (error) {
    console.log("error in logout controller", error);
    res.status(500).json({
      status: "fail",
      message: "server error",
      error: error.message,
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ status: "fail", message: "No refresh token provided" });
    }

    // get the user
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
    // get the refresh token from redis
    const redisRefreshToken = await client.get(
      `refresh_token:${decoded.userId}`
    );

    if (refreshToken !== redisRefreshToken) {
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid refresh token" });
    }

    // regenerate a new access token
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_SECRET_KEY,
      {
        expiresIn: "15m",
      }
    );

    // resend the cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({
      status: "success",
      message: "token refreshed successfully",
    });
  } catch (error) {
    console.log("error in refreshing access token", error);
    res.status(500).json({
      status: "fail",
      message: "server error",
      error: error.message,
    });
  }
};
