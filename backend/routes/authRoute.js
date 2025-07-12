import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ConvexHttpClient } from "convex/browser"; // ✅ Works in backend

dotenv.config();

const router = express.Router();

// ✅ Convex client
const convex = new ConvexHttpClient(process.env.CONVEX_URL, {
  deploymentToken: process.env.CONVEX_DEPLOY_KEY,
});

// ✅ Signup: hash password, insert user
// backend/authRoute.js

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertedUserId = await convex.mutation("users:insertUser", {
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("🔴 Signup error:", error.message);

    if (error.message === "User already exists") {
      return res.status(409).json({ message: "User already exists" }); // ⚠️ Proper status code
    }

    res.status(500).json({ message: error.message || "Signup failed" });
  }
});

// ✅ Login: get user and verify password
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await convex.query("users:getUserByEmail", { email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "Use Google login instead" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("🔴 Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
