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
    // Check if saved already
    const { data: existing, error: fetchError } = await supabase
      .from("saveplace")
      .select("*")
      .eq("userId", userId)
      .eq("placeId", placeId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    if (existing) {
      // Unsave
      const { error: deleteError } = await supabase
        .from("saveplace")
        .delete()
        .eq("id", existing.id);

      if (deleteError) throw deleteError;

      return res.status(200).json({ saved: false });
    } else {
      // Save
      const { error: insertError } = await supabase.from("saveplace").insert([
        {
          userId,
          placeId,
        },
      ]);

      if (insertError) throw insertError;

      return res.status(201).json({ saved: true });
    }
  } catch (error) {
    console.error("🔴 Toggle save error:", error);
    res.status(500).json({ message: "Toggle failed", error: error.message });
  }
});

// Get saved places for user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const { data, error } = await supabase
      .from("saveplace")
      .select("*")
      .eq("userId", userId);

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("🔴 Get saved error:", error);
    res.status(500).json({ message: "Fetch failed", error: error.message });
  }
});

export default router;
