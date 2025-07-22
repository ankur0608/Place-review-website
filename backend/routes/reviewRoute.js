import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import supabase from "../lib/supabaseClient.js";
import places from "../data/placesData.js";

const router = express.Router();

router.post("/:id/reviews", verifyToken, async (req, res) => {
  const id = Number(req.params.id);
  const place = places.find((p) => p.id === id);
  if (!place) return res.status(404).json({ message: "Place not found" });

  const { name, rating, comment, photo } = req.body;

  const { error } = await supabase.from("reviews").insert([
    {
      name: name || req.user.email,
      rating,
      comment,
      photo,
      place_id: req.params.id,
      place_name: place.name,
      user_id: req.user.id,
    },
  ]);

  if (error) return res.status(500).json({ message: "Failed to save review" });

  res.status(201).json({ message: "Review added successfully" });
});
router.get("/:id/reviews", async (req, res) => {
  const placeId = req.params.id.toString();

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("place_id", placeId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase fetch error:", error);
    return res.status(500).json({ message: "Failed to fetch reviews" });
  }

  res.json(data);
});
