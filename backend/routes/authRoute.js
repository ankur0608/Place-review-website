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
        emailRedirectTo:
          "https://place-review-website-real.vercel.app/verify-email",
      },
    });

    if (error) {
      if (error.message.includes("User already registered")) {
        return res.status(409).json({ message: "User already exists" });
      }
      throw error;
    }

    // ✅ INSERT INTO PROFILES TABLE
    if (data?.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        email,
        name: username,
      });
    }

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
    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = loginData.user;

    if (!user?.email_confirmed_at) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in." });
    }

    // ✅ Fetch latest user info using session access_token
    const accessToken = loginData.session.access_token;

    const { data: userInfo, error: userError } = await supabase.auth.getUser(
      accessToken
    );

    if (userError || !userInfo?.user) {
      console.error("Failed to fetch user data:", userError);
      return res.status(500).json({ message: "Could not fetch user profile" });
    }

    const fullUser = userInfo.user;

    const token = jwt.sign(
      { id: fullUser.id, email: fullUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: fullUser.id,
        email: fullUser.email,
        username: fullUser.user_metadata?.username || "",
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ message: "Server error during login" });
  }
});

export default router;
