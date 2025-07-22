import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// GET all places
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("places").select("*");

    if (error) {
      console.error("Supabase fetch error:", error.message);
      return res.status(500).json({ message: "Failed to fetch places." });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;
