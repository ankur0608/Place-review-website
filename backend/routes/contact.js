import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// POST /contact
router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const { error } = await supabase.from("contact").insert([
      {
        name,
        email,
        message,
        // created_at will be auto-generated
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: "Failed to save contact message" });
    }

    res.status(201).json({ message: "Contact message submitted successfully" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
