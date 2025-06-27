import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useState } from "react";
import styles from "./SavedPlace.module.css";
import heartFilled from "../assets/heart2.png";
import heartOutline from "../assets/heart.png";
import { useTheme } from "../store/ThemeContext";

export default function SavedPlace() {
  const userId = localStorage.getItem("id");
  const { theme } = useTheme();
  const savedPlaces = useQuery(
    api.saveplace.getSaved,
    userId ? { userId } : "skip"
  );

  const toggleSave = useMutation(api.saveplace.toggle);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    async function fetchSavedDetails() {
      if (!savedPlaces) return;

      const results = await Promise.all(
        savedPlaces.map(async (p) => {
          const res = await fetch(
            `https://place-review-website-real.onrender.com/places/${p.placeId}`
          );
          return res.ok ? await res.json() : null;
        })
      );

      setPlaces(results.filter(Boolean));
    }

    fetchSavedDetails();
  }, [savedPlaces]);

  const handleToggleSave = async (placeId) => {
    if (!userId) return alert("Please log in");
    try {
      await toggleSave({ userId: String(userId), placeId: String(placeId) });
    } catch (err) {
      console.error("Error toggling save:", err.message);
    }
  };

  if (!savedPlaces || savedPlaces.length === 0) {
    return <p>📭 No saved places found.</p>;
  }

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <h2 className={styles.heading}>📍 Saved Places</h2>
      <div className={styles.grid}>
        {places.map((place) => (
          <div className={styles.card} key={place.id}>
            <img src={place.image} alt={place.name} className={styles.image} />
            <div className={styles.textContent}>
              <div className={styles.headerRow}>
                <h3 className={styles.name}>{place.name}</h3>
                <img
                  src={heartFilled}
                  alt="Unsave"
                  className={styles.heartIcon}
                  onClick={() => handleToggleSave(place.id)}
                  title="Click to remove from saved"
                />
              </div>
              <p className={styles.location}>📍 {place.location}</p>
              <p className={styles.description}>{place.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
