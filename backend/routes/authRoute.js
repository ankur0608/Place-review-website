import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ConvexHttpClient } from "convex/server"; // Use Convex from Node server
import { api } from "../convex/_generated/api"; // Adjust path as needed

dotenv.config();

const router = express.Router();

// ✅ Convex client
const convex = new ConvexHttpClient(process.env.CONVEX_URL, {
  deploymentToken: process.env.CONVEX_DEPLOY_KEY,
});

// ✅ Signup → hash password and store via Convex mutation
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Hash the password
    const hashed = await bcrypt.hash(password, 10);

    // Insert into Convex
    await convex.mutation(api.users.insertUser, {
      username,
      email,
      password: hashed,
    });

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// ✅ Login → fetch user from Convex and validate password
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Get user from Convex
    const user = await convex.query(api.users.getUserByEmail, { email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "Use Google login instead" });
    }

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Sign JWT token
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
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;
