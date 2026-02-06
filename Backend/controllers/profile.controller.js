import { updateProfileSchema, updateEmailSchema } from "../validators/profile.validator.js";
import bcrypt from "bcryptjs";
import User from "../models/users.model.js";

export const getProfile = async (req, res) => {
  try {
    // console.log(req.user);
    const userProfile = await User.findById(req.user.id).select("-passwordHash",);
    if (!userProfile) {
      return res.status(404).json({ error: "User not found" });
    }
    // console.log(userProfile);
    res.status(200).json({ user: userProfile });
  } catch (error) {
    console.log(`GetProfile error: ${error}`)
    res.status(400).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const validatedData = updateProfileSchema.safeParse(req.body);
    // console.log(validatedData);
    if (!validatedData.success) {
      return res
        .status(400)
        .json({ message: validatedData.error.issues[0].message });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: validatedData.data },
      { new: true }).select("-passwordHash");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(`update Profile Error: ${error}`)
    res.status(400).json({ message: error.errors ? error.errors : error.message });
  }
};

export const updateEmail = async (req, res) => {
  try {
    const validatedData = updateEmailSchema.safeParse(req.body);
    if (!validatedData.success) {
      return res
        .status(400)
        .json({ message: validatedData.error.issues[0].message });
    }
    // console.log(validatedData.data);
    const { email } = validatedData.data;
    const updatedUser = await User
      .findByIdAndUpdate(req.user.id, { $set: { email } }, { new: true })
      .select("-passwordHash");
    res
      .status(200)
      .json({ message: "Email updated successfully", user: updatedUser });
  } catch (error) {
    console.log(`update Email Error: ${error}`)
    res.status(400).json({ message: error.errors ? error.errors : error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "New password must be at least 8 characters long" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const existingUser = await User.findById(req.user.id);
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "User not found, Please login Again" });
    }
    const isMatch = await bcrypt.compare(
      currentPassword,
      existingUser.password,
    );
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    const updatedUser = await User
      .findByIdAndUpdate(
        req.user.userId,
        { $set: { password: hashedPassword } },
        { new: true },
      )
      .select("-passwordHash");
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(`Update Pass Error: ${error}`)
    res.status(400).json({ message: error.errors ? error.errors : error.message });
  }
};

export const disableAccount = async (req, res) => {
  try {
    const userId = req.user.id;  
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found, Please login first." });
    }

    user.isActive = false;
    await user.save();

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    };

    res.clearCookie("token", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    return res.json({ message: "Account disabled successfully" });
  } catch (error) {
    console.log(`Disable account err: ${error}`)
    return res.status(500).json({message: "Server Error, Please Try After Some Time"})
  }
}

export const permanentDelete = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found, Please login first." });
    }
    await user.findByIdAndDelete(req.user.id);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    };

    res.clearCookie("token", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.log(`Delete Account Error: ${error}`)
    return res.status(500).json({ message: "Server Error" })
  }
}