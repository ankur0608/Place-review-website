import express from "express";
import multer from "multer";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// Setup multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/reviews
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    console.log("📥 Incoming Review Request");

    const { comment, rating, place_id, user_id, name } = req.body;
    console.log("📝 Review Data:", {
      comment,
      rating,
      place_id,
      user_id,
      name,
    });

    let photoURL = null;

    if (req.file) {
      console.log("📷 Photo file received:", req.file.originalname);

      const fileExt = req.file.originalname.split(".").pop();
      const fileName = `${Date.now()}-${user_id}.${fileExt}`;

      console.log("📂 Uploading to Supabase Storage:", `reviews/${fileName}`);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("review-photos")
        .upload(`reviews/${fileName}`, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (uploadError) {
        console.error("❌ Supabase Storage Upload Error:", uploadError);
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("review-photos")
        .getPublicUrl(`reviews/${fileName}`);

      photoURL = publicUrlData.publicUrl;
      console.log("✅ Uploaded Photo URL:", photoURL);
    } else {
      console.log("🛑 No photo uploaded.");
    }

    console.log("🗃 Inserting review into Supabase...");
    const { data, error } = await supabase.from("reviews").insert([
      {
        comment,
        rating: parseInt(rating),
        photo: photoURL,
        place_id,
        user_id,
        name,
      },
    ]);

    if (error) {
      console.error("❌ Supabase Insert Error:", error);
      throw error;
    }

    console.log("✅ Review inserted successfully:", data);
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("🔥 Review Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
