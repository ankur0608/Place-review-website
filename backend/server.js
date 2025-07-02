const express = require("express");
const cors = require("cors");
const placesRoute = require("./routes/placesRoute"); // 📦 Your protected + public place routes
const authRoute = require("./routes/authRoute"); // 🔐 Signup, login
const contactRoute = require("./routes/contact");
const chatRoute = require("./routes/chatRoute");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable cross-origin requests
app.use(express.json()); // Parse JSON in requests

app.use("/places", placesRoute); // All /places/* routes
app.use("/", authRoute); // /signup, /login
app.use("/contact", contactRoute);
app.use("/api/chat", chatRoute);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
