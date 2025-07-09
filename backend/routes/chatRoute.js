import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const HF_MODEL = process.env.HUGGINGFACE_MODEL || "gpt2";
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Static FAQ responses
const faqs = {
  "what are the best-rated places near me?":
    "We recommend top-rated places based on user reviews in your area. You can enable location access to get more accurate suggestions.",
  "can i book a visit for a specific date and time?":
    "Yes, you can select a date and time while booking. Just go to the place's detail page and click “Book Now” or “Reserve”.",
  "how do i find places by location or state?":
    "Use the filters on the homepage or search bar to filter places by city, state, or pin code.",
  "i can't log in — what should i do?":
    "Try resetting your password using the 'Forgot Password' link. If you're still facing issues, contact support.",
  "how do i leave a review for a place?":
    "Go to the place's detail page and scroll down to the reviews section. You must be logged in to post a review.",
  "can i edit or delete my review later?":
    "Yes, go to your profile → 'My Reviews' → select the review → edit or delete as needed.",
  "how are place ratings calculated?":
    "Ratings are calculated as an average of all user-submitted scores, considering both recent and relevant reviews.",
  "how do i contact support?":
    "You can email us at support@example.com or use the contact form in the Help section of the app.",
  "can i update my booking details later?":
    "Yes, go to your profile → 'My Bookings' → select the booking → edit time or cancel if allowed by the place policy.",
};

router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message is required" });
  }

  const lowerMsg = message.toLowerCase().trim();

  // ✅ Dynamic date logic
  if (
    lowerMsg.includes("today's date") ||
    lowerMsg.includes("what is the date") ||
    lowerMsg.includes("current date") ||
    lowerMsg === "date" ||
    lowerMsg === "today"
  ) {
    const today = new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    console.log("🕒 Server-generated date:", today);
    return res.json({ reply: `Today is ${today}.`, model: "System Clock" });
  }

  // ✅ Static FAQ match (case-insensitive)
  const matchedFaq = Object.keys(faqs).find((key) => key === lowerMsg);
  if (matchedFaq) {
    return res.json({ reply: faqs[matchedFaq], model: "Static FAQ" });
  }

  // ❓ Otherwise, use Hugging Face AI
  try {
    const response = await axios.post(
      HF_API_URL,
      { inputs: message },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
        },
      }
    );

    const data = response.data;
    let reply = "No response";

    if (Array.isArray(data) && data[0]?.generated_text) {
      reply = data[0].generated_text;
    } else if (typeof data === "object" && data.generated_text) {
      reply = data.generated_text;
    } else if (typeof data === "string") {
      reply = data;
    }

    res.json({ reply, model: HF_MODEL });
  } catch (error) {
    console.error("Hugging Face API error:", error.message);
    res.status(500).json({ reply: "AI unavailable", model: HF_MODEL });
  }
});

export default router;
