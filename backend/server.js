require("dotenv").config(); // Load env vars

const express = require("express");
const cors = require("cors");

const placesRoute = require("./routes/placesRoute");
const authRoute = require("./routes/authRoute");
const contactRoute = require("./routes/contact");
const chatRoute = require("./routes/chatRoute");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS middleware
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(express.json());

// Routes
app.use("/places", placesRoute);
app.use("/", authRoute);
app.use("/contact", contactRoute);
app.use("/api/chat", chatRoute);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
