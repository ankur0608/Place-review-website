import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import placesRoute from "./routes/placesRoute.js";
import authRoute from "./routes/authRoute.js";
import contactRoute from "./routes/contact.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Recommended CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Use http, not https, for local dev
      "https://place-review-website-real.vercel.app",
      "https://place-review-website-git-eecdf1-ankur-patels-projects-15e166ca.vercel.app",
      "https://place-review-website-real-dxm9j4602.vercel.app", // Fixed missing https
    ],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Route middleware
app.use("/places", placesRoute);
app.use("/api/auth", authRoute);
app.use("/contact", contactRoute);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
