// routes/places.js
import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// GET all places
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("places").select("*");

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET place by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("places")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
