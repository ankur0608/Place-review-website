// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Core dependencies
import express from "express";
import cors from "cors";

// Import route handlers (make sure these files have `.js` extensions)
import placesRoute from "./routes/placesRoute.js";
import authRoute from "./routes/authRoute.js";
import contactRoute from "./routes/contact.js";

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow frontend domains to access backend with cookies or JWT
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev (Vite)
      "https://place-review-website-real.vercel.app",
      "https://place-review-website-git-eecdf1-ankur-patels-projects-15e166ca.vercel.app",
      "https://place-review-website-real-dxm9j4602.vercel.app",
    ],
    credentials: true, // Allow cookies and Authorization headers
  })
);

// ✅ Parse incoming JSON requests
app.use(express.json());

// ✅ Route middleware
app.use("/places", placesRoute);
app.use("/api/auth", authRoute);
app.use("/contact", contactRoute);

// ✅ Catch-all route (optional)
app.get("/", (req, res) => {
  res.send("🌍 Welcome to the Place Review API!");
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
