// routes/contact.js

const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  console.log("📩 New contact message received:");
  console.log("👤 Name:", name);
  console.log("📧 Email:", email);
  console.log("💬 Message:", message);

  // You can store it in DB or send an email here
  res.status(200).json({ message: "Message received. Thank you!" });
});

module.exports = router;
