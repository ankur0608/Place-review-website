const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const { ConvexHttpClient } = require("convex/browser");
const convex = new ConvexHttpClient(process.env.CONVEX_URL);

// Gemini endpoint
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
  process.env.GEMINI_API_KEY;

router.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    // Call Gemini REST API
    const response = await axios.post(GEMINI_API_URL, {
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });

    const reply = response.data.candidates[0].content.parts[0].text;

    // Save to Convex
    await convex.mutation("messages:add", { sender: "user", text: message });
    await convex.mutation("messages:add", { sender: "bot", text: reply });

    res.json({ reply });
  } catch (error) {
    console.error("Gemini Chat Error:", error.response?.data || error.message);
    res.status(500).json({ reply: "AI unavailable" });
  }
});

module.exports = router;
