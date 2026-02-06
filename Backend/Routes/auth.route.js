import express from 'express'
import User from '../models/users.model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import {register, login, refresh} from "../controllers/auth.controller.js"


const router = express.Router()

router.post("/register", register)

router.post("/login", login);

router.post("/refresh", refresh);

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