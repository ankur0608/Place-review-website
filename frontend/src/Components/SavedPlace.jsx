import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "./SavedPlace.module.css";
import heartFilled from "../../src/assets/heart2.png"; // filled (saved)
import heartOutline from "../../src/assets/heart.png"; // outline (unsaved look)

const SavedPlaces = () => {
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("id");

  const fetchSavedPlaces = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://place-review-website-real.onrender.com/api/savedplaces/user/${userId}`
      );

      if (!Array.isArray(res.data)) {
        toast.error("Invalid data format");
        return;
      }

      setSavedPlaces(res.data);
    } catch (err) {
      toast.error("Failed to fetch saved places");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchSavedPlaces();
    } else {
      toast.error("User not logged in");
    }
  }, [userId]);

  const handleUnsave = async (placeId) => {
    try {
      const res = await axios.post(
        "https://place-review-website-real.onrender.com/api/savedplaces/toggle",
        { userId, placeId }
      );

      if (res.data.saved === false) {
        toast.success("Removed from saved places");
        fetchSavedPlaces();
      } else {
        toast.error("Failed to unsave");
      }
    } catch (error) {
      console.error("Unsave error:", error);
      toast.error("Unsave failed");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Saved Places</h2>

      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : savedPlaces.length === 0 ? (
        <p className={styles.noPlaces}>You haven't saved any places yet.</p>
      ) : (
        <div className={styles.grid}>
          {savedPlaces.map((saved) => {
            const place = saved.places;

            return (
              <div key={saved.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  {place?.image_url && (
                    <img
                      src={
                        place.image_url.startsWith("http")
                          ? place.image_url
                          : `https://your-supabase-project.supabase.co/storage/v1/object/public/your-bucket/${place.image_url}`
                      }
                      alt={place?.name}
                      className={styles.image}
                    />
                  )}

                  <img
                    src={heartFilled}
                    alt="Unsave"
                    className={styles.heartIcon}
                    title="Remove from saved"
                    onClick={() => handleUnsave(place.id)}
                  />
                </div>

                <div className={styles.content}>
                  <h3>{place?.name || "Unnamed Place"}</h3>
                  <p className={styles.description}>
                    {place?.description || "No description available."}
                  </p>
                  <div className={styles.meta}>
                    {place?.state && <span>📍 {place.state}</span>}
                    {place?.category && <span>🏷 {place.category}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedPlaces;
