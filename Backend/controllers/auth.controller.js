import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import bcrypt from "bcryptjs";
import User from "../models/users.model.js";
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
  try {
    const validatedInfo = registerSchema.safeParse(req.body);
    if (!validatedInfo.success) {
      return res.status(400).json({message: validatedInfo.error.issues.map(err => err.message)[0]})
    }

    let { username, email, password } = validatedInfo.data;
    email = email.toLowerCase()

    const existingUser = await User.findOne({
      $or: [{ email }, {username}]
    })

    if (existingUser) {
      return res.status(409).json({ message: "Username or Email is already in Use" });
    }

    const hashedPass = await bcrypt.hash(password, 10)
    const newUser = new User({
      username,
      email,
      passwordHash: hashedPass
    })

    await newUser.save()
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    return res
      .status(500)
      .json({ message: "Server error during registration" });
  }
}

export const login = async (req, res) => {
  try {
    const validatedInfo = loginSchema.safeParse(req.body);
    if (!validatedInfo.success) {
      return res
        .status(400)
        .json({
          message: validatedInfo.error.issues.map((err) => err.message)[0],
        });
    }

    let { identifier, password } = validatedInfo.data;
    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase()}, {username: identifier }],
    });
    // console.log(user)

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({
        code: "ACCOUNT_DISABLED",
        message: "Your account was disabled by you. Do you want to restore it?",
        restoreRequired: true,
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    const refreshToken = jwt.sign(
      { id: user._id, username: user.username },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 1 * 60 * 60 * 1000,
    });
    // current and refresh tokens
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
}


export const restoreAccount = async (req, res) => {
  try {
    const { identifier } = req.body;

    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = true;
    await user.save();

    return res.json({
      message: "Account restored successfully. Please login again.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};


export const refresh = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Please login again" });
  }
  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {            // /refresh route to get refresh token
    if (err) {
      return res.status(403).json({
        code: "REFRESH_TOKEN_EXPIRED",
        message: "Invalid or expired refresh token"
      });
    }
    const newToken = jwt.sign(
      { id: decoded.id, username: decoded.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 1 * 60 * 60 * 1000,
    });
    return res.json({ message: "Token refreshed successfully" });
  });
}


export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict", // logout and cookie clear
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  return res.json({ message: "Logged out successfully" });
}