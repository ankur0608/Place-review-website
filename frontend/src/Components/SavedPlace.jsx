import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "./SavedPlace.module.css";

const SavedPlaces = () => {
  const [savedPlaces, setSavedPlaces] = useState([]);
  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchSavedPlaces = async () => {
      try {
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
      }
    };

    if (userId) {
      fetchSavedPlaces();
    } else {
      toast.error("User not logged in");
    }
  }, [userId]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Saved Places</h2>

      {savedPlaces.length === 0 ? (
        <p className={styles.noPlaces}>You haven't saved any places yet.</p>
      ) : (
        <div className={styles.grid}>
          {savedPlaces.map((saved) => {
            const place = saved.places;

            return (
              <div key={saved.id} className={styles.card}>
                <h3>{place?.name || "Unnamed Place"}</h3>

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

                <p className={styles.description}>
                  {place?.description || "No description available."}
                </p>
                <div className={styles.meta}>
                  {place?.state && <span>📍 {place.state}</span>}
                  {place?.category && <span>🏷 {place.category}</span>}
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
