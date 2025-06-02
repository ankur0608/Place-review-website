const express = require("express");
const cors = require("cors");
const placesRoute = require("./routes/placesRoute");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use("/places", placesRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
