import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { supabase } from "../supabaseClient.js";

dotenv.config();

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: "https://place-review-website-real.onrender.com/verify-email",
      },
    });

    if (error) {
      if (error.message.includes("User already registered")) {
        return res.status(409).json({ message: "User already exists" });
      }
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Signup successful. Please verify your email.",
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Signup failed" });
  }
});

// ✅ Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!data.user?.email_confirmed_at) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in." });
    }

    const token = jwt.sign(
      { id: data.user.id, email: data.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: data.user.id,
        username: data.user.user_metadata?.username || "",
        email: data.user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;
