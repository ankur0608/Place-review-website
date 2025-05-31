const express = require("express");
const router = express.Router();
const places = require("../data/placesData.js");

router.get("/", (req, res) => {
  res.json(places);
});

module.exports = router;
