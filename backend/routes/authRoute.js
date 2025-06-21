const express = require("express");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const router = express.Router();

// Signup → hash password
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    res.status(200).json({ username, email, password: hashed });
  } catch (error) {
    res.status(500).json({ message: "Server error during signup" });
  }
});

// Login → verify password
// Login → verify password and return token
router.post("/login", async (req, res) => {
  try {
    const { password, user } = req.body;

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // valid for 1 day
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
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;
