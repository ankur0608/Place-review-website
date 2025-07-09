import express from "express";
import places from "../data/placesData.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Get all places
router.get("/", (req, res) => {
  res.json(places);
});

// Get a specific place by ID
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const place = places.find((p) => p.id === id);
  if (!place) {
    return res.status(404).json({ message: "Place not found" });
  }
  res.json(place);
});

// Add a review to a place
router.post("/:id/reviews", verifyToken, (req, res) => {
  const id = Number(req.params.id);
  const place = places.find((p) => p.id === id);
  if (!place) {
    return res.status(404).json({ message: "Place not found" });
  }

  const { name, rating, comment } = req.body;
  if (!place.reviews) place.reviews = [];

  const userEmail = req.user.email;

  place.reviews.push({
    name: name || userEmail,
    rating,
    comment,
  });

  res.status(201).json(place.reviews);
});

export default router;
