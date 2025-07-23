import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// Toggle save / unsave
router.post("/toggle", async (req, res) => {
  const { userId, placeId } = req.body;

  if (!userId || !placeId) {
    return res.status(400).json({ message: "Missing userId or placeId" });
  }

  try {
    // Check if place is already saved
    const { data: existing, error: fetchError } = await supabase
      .from("savedplaces")
      .select("*")
      .eq("user_id", userId)
      .eq("place_id", placeId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    if (existing) {
      // If exists, remove it (unsave)
      const { error: deleteError } = await supabase
        .from("savedplaces")
        .delete()
        .eq("id", existing.id);

      if (deleteError) throw deleteError;

      return res.status(200).json({ saved: false });
    } else {
      // If not exists, insert new (save)
      const { error: insertError } = await supabase
        .from("savedplaces")
        .insert([{ user_id: userId, place_id: placeId }]);

      if (insertError) throw insertError;

      return res.status(201).json({ saved: true });
    }
  } catch (error) {
    console.error("Toggle save error:", error);
    res.status(500).json({ message: "Toggle failed", error: error.message });
  }
});

// Get saved places for a user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const { data, error } = await supabase
      .from("savedplaces")
      .select(`
        id,
        created_at,
        place_id,
        places:place_id (
          id,
          name,
          state,
          category,
          description,
          image_url
        )
      `)
      .eq("user_id", userId);

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Get saved places error:", error);
    res.status(500).json({ message: "Fetch failed", error: error.message });
  }
});


export default router;
