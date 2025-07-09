import express from "express";

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

  // Optionally: Save to DB or send email

  res.status(200).json({ message: "Message received. Thank you!" });
});

export default router;
