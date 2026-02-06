import { registerSchema, loginSchema } from "../validators/auth.validator";
import bcrypt from "bcryptjs";
import User from "../models/users.model";
import { success } from "zod";

export const register = async (req, res) => {
  try {
    const validatedInfo = registerSchema.safeParse(req.body);
    if (!success) {
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
    console.error("Registration error:", err);
    return res
      .status(500)
      .json({ message: "Server error during registration" });
  }
}

export const login = async (req, res) => {
  try {
    const validatedInfo = loginSchema.safeParse(req.body);
    if (!success) {
      return res
        .status(400)
        .json({
          message: validatedInfo.error.issues.map((err) => err.message)[0],
        });
    }

    let { identifier, password } = validatedInfo.data;
    const user = User.findOne({
      $or: [{ email: identifier.toLowerCase(), username: identifier }],
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid credentials" });
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
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
}