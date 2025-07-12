import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ConvexHttpClient } from "convex/browser";

dotenv.config();

const router = express.Router();

// ✅ Convex client
const convex = new ConvexHttpClient(process.env.CONVEX_URL, {
  deploymentToken: process.env.CONVEX_DEPLOY_KEY,
});

// ✅ Signup route with duplicate check
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await convex.query("users:getUserByEmail", { email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await convex.mutation("users:insertUser", {
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("🔴 Signup error:", error.message);
    res.status(500).json({ message: "Signup failed" });
  }
});

// ✅ Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📥 Login attempt for:", email);

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await convex.query("users:getUserByEmail", { email });
    console.log("🔍 Fetched user:", user);

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
  } catch (error) {
    console.error("🔴 Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;
