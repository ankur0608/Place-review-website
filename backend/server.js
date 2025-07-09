import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import placesRoute from "./routes/placesRoute.js";
import authRoute from "./routes/authRoute.js";
import contactRoute from "./routes/contact.js";
import chatRoute from "./routes/chatRoute.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://place-review-website-real.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use("/places", placesRoute);
app.use("/api/auth", authRoute);
app.use("/contact", contactRoute);
app.use("/api/chat", chatRoute);
console.log(
  "🤖 Using Hugging Face model:",
  process.env.HUGGINGFACE_MODEL || "gpt2"
);
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
