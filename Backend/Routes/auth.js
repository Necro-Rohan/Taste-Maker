import express from 'express'
import User from '../dbmodels/users.model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'


const router = express.Router()

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newEmail = email.toLowerCase();
    const newUsername = username.toLowerCase();
    const existingUser = await User.findOne({                               //register route
      $or: [{ email: newEmail }, { username: newUsername }],
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Username or Email already in use" });
    }
    const newUser = new User({
      username: newUsername,
      email: newEmail,
      passwordHash: await bcrypt.hash(password, 10),
    });
    await newUser.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    return res
      .status(500)
      .json({ message: "Server error during registration" });
  }
});

router.post("/login", async (req, res) => {
  const { password, identifier } = req.body;
  try {
    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Email or Username and Password are required" });                  //  /login route 
    }
    const user = await User.findOne({
      $or: [{email: identifier.toLowerCase()}, {username:identifier.toLowerCase()}]
    });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, username: user.username },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie('token', token, {
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
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
});

router.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Please Check Credentials" });
  }
  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {                  // /refresh route to get refresh token
    if (err) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
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
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",                                                       // logout and cookie clear
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  return res.json({ message: "Logged out successfully" });
});

export default router;