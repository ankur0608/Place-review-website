const express = require("express");
const router = express.Router();
const places = require("../data/placesData.js");

router.get("/", (req, res) => {
  res.json(places);
});

// In your placesRoute.js
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const place = places.find((p) => p.id === id);
  if (!place) {
    return res.status(404).json({ message: "Place not found" });
  }
  res.json(place);
});

module.exports = router;
