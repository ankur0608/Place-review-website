import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import supabase from "../lib/supabaseClient.js";

const router = express.Router();

// POST /api/places/:id/reviews
router.post("/:id/reviews", verifyToken, async (req, res) => {
  const placeId = req.params.id;
  const { name, rating, comment, photo } = req.body;

  try {
    // Optional: verify that place exists in Supabase
    const { data: place, error: placeError } = await supabase
      .from("places")
      .select("name")
      .eq("id", placeId)
      .single();

    if (placeError || !place) {
      return res.status(404).json({ message: "Place not found" });
    }

    const { error } = await supabase.from("reviews").insert([
      {
        name: name || req.user.email,
        rating,
        comment,
        photo,
        place_id: placeId,
        place_name: place.name,
        user_id: req.user.id,
      },
    ]);

    if (error) {
      console.error("Insert error:", error);
      return res.status(500).json({ message: "Failed to save review" });
    }

    res.status(201).json({ message: "Review added successfully" });
  } catch (err) {
    console.error("Unexpected error:", err.message);
    res.status(500).json({ message: "Unexpected server error" });
  }
});

// GET /api/places/:id/reviews
router.get("/:id/reviews", async (req, res) => {
  const placeId = req.params.id;

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

export default router;
