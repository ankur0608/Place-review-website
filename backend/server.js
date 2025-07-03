require("dotenv").config(); // 🔑 Load environment variables

const express = require("express");
const cors = require("cors");

const placesRoute = require("./routes/placesRoute"); // 📍 Public/private places
const authRoute = require("./routes/authRoute"); // 🔐 Signup/Login
const contactRoute = require("./routes/contact"); // 📬 Contact form
const chatRoute = require("./routes/chatRoute"); // 💬 Real-time chat
const forgotPasswordRoute = require("./routes/forgotPasswordRoute"); // 🔑 Password reset

const app = express();
const PORT = process.env.PORT || 5000;

const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173", // dev
  "https://place-review-website-real.vercel.app", // production
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(cors()); // ✅ Allow frontend access
app.use(express.json()); // ✅ Enable JSON body parsing

// 🛣️ Register route handlers
app.use("/places", placesRoute);
app.use("/", authRoute);
app.use("/contact", contactRoute);
app.use("/api/chat", chatRoute);
app.use("/forgot-password", forgotPasswordRoute);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
