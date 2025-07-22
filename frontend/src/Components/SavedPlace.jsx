import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SavedPlace.module.css";
import heartFilled from "../assets/heart2.png";
import { useTheme } from "../store/ThemeContext.jsx";
import Loading from "./Loading.jsx";

export default function SavedPlace() {
  const userId = localStorage.getItem("id");
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchSaved() {
      setLoading(true);
      try {
        // Replace this with your actual API to get saved places by userId
        const res = await fetch(
          `https://place-review-website-real.onrender.com/api/savedplaces/user/${userId}`
        );
        if (!res.ok) throw new Error("Failed to fetch saved places");

        const data = await res.json();
        setSavedPlaces(data); // data should be array of saved places with place_id
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchSaved();
  }, [userId]);

  const handleToggleSave = async (placeId) => {
    if (!userId) return alert("Please log in");

    try {
      // Replace with your actual toggle save API
      const res = await fetch(
        `https://place-review-website-real.onrender.com/api/savedplaces/toggle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, placeId }),
        }
      );

      if (!res.ok) throw new Error("Toggle save failed");

      // Refetch saved places after toggle
      const refreshedRes = await fetch(
        `https://place-review-website-real.onrender.com/api/savedplaces/user/${userId}`
      );
      const refreshedData = await refreshedRes.json();
      setSavedPlaces(refreshedData);
    } catch (err) {
      alert(err.message);
    }
  };

  if (!userId) return <p>Please log in to see saved places.</p>;
  if (loading) return <Loading />;
  if (savedPlaces.length === 0) return <p>No saved places yet.</p>;

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <h2 className={styles.heading}>📍 Saved Places</h2>
      <div className={styles.grid}>
        {savedPlaces.map(({ place_id }) => (
          <SavedPlaceCard
            key={place_id}
            placeId={place_id}
            onToggleSave={() => handleToggleSave(place_id)}
          />
        ))}
      </div>
    </div>
  );
}

function SavedPlaceCard({ placeId, onToggleSave }) {
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlace() {
      setLoading(true);
      try {
        // Corrected API url with /api
        const res = await fetch(
          `https://place-review-website-real.onrender.com/api/places/${placeId}`
        );
        if (!res.ok) throw new Error("Failed to fetch place details");
        const data = await res.json();
        setPlace(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlace();
  }, [placeId]);

  if (loading) return <div>Loading place...</div>;
  if (!place) return null;

  return (
    <div className={styles.card}>
      <img
        src={place.image_url || "/placeholder.jpg"}
        alt={place.name}
        className={styles.image}
        loading="lazy"
      />
      <div className={styles.textContent}>
        <h3>{place.name}</h3>
        <p>{place.location}</p>
        <button onClick={onToggleSave} className={styles.removeButton}>
          Remove from saved
        </button>
      </div>
    </div>
  );
}
