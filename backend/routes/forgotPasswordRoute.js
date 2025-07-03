const express = require("express");
const router = express.Router();
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

// ✅ Convex deployment + secret key from .env
const CONVEX_DEPLOYMENT_URL = "https://tidy-stoat-569.convex.cloud";
const CONVEX_DEPLOY_KEY = process.env.CONVEX_DEPLOY_KEY; // Make sure this is set in your .env file

// ✅ Forgot Password: Request Reset Link
router.post("/request-password-reset", async (req, res) => {
  const { email } = req.body;
  const token = uuidv4();
  const expiry = Date.now() + 15 * 60 * 1000;

  console.log("📧 Email requested for reset:", email);
  console.log("🔐 Token generated:", token);

  try {
    const response = await axios.post(
      `${CONVEX_DEPLOYMENT_URL}/api/functions/setResetToken`,
      { email, token, expiry },
      {
        headers: {
          Authorization: `Bearer ${CONVEX_DEPLOY_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ setResetToken response:", response.data);

    const resetLink = `http://localhost:5173/reset-password?token=${token}`;
    console.log("🔗 Reset link:", resetLink);

    res.json({ message: "Password reset link sent" });
  } catch (err) {
    console.error("❌ setResetToken Error:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to send reset link" });
  }
});

// ✅ Forgot Password: Reset Password using Token
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  console.log("🔐 Attempting password reset with token:", token);

  try {
    const { data: user } = await axios.post(
      `${CONVEX_DEPLOYMENT_URL}/api/functions/getUserByToken`,
      { token },
      {
        headers: {
          Authorization: `Bearer ${CONVEX_DEPLOY_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("🔍 User fetched by token:", user);

    if (!user || Date.now() > user.resetTokenExpiry) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("🔒 New password hashed");

    await axios.post(
      `${CONVEX_DEPLOYMENT_URL}/api/functions/updatePassword`,
      {
        userId: user._id,
        newPassword: hashedPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${CONVEX_DEPLOY_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Password updated in Convex");

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(
      "❌ Reset Password Error:",
      err.response?.data || err.message
    );
    res.status(500).json({ message: "Error resetting password" });
  }
});

module.exports = router;
