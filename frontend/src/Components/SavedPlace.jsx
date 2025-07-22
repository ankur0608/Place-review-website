import { useEffect, useState } from "react";
import { useTheme } from "../store/ThemeContext.jsx";
import styles from "./SavedPlace.module.css";
import Loading from "./Loading.jsx";

export default function SavedPlaces() {
  const userId = localStorage.getItem("id");
  const { theme } = useTheme();

  const [savedPlaces, setSavedPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch saved places for this user
  const fetchSavedPlaces = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/savedplaces/user/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch saved places");

      const data = await res.json();
      setSavedPlaces(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedPlaces();
  }, [userId]);

  // Toggle save / remove saved place
  const handleToggleSave = async (placeId) => {
    if (!userId) {
      alert("Please log in to manage saved places.");
      return;
    }

    try {
      const res = await fetch("/api/savedplaces/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, placeId }),
      });

      if (!res.ok) throw new Error("Failed to toggle saved place");

      // Refresh saved places after toggle
      fetchSavedPlaces();
    } catch (err) {
      alert(err.message);
    }
  };

  if (!userId) {
    return <p>Please log in to see your saved places.</p>;
  }

  if (loading) return <Loading />;

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  if (savedPlaces.length === 0)
    return <p>You don't have any saved places yet.</p>;

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <h2 className={styles.heading}>📍 Your Saved Places</h2>

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch place details by placeId
  useEffect(() => {
    const fetchPlace = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://place-review-website-real.onrender.com/api/places/${placeId}`
        );
        if (!res.ok) throw new Error("Failed to fetch place details");

        const data = await res.json();
        setPlace(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [placeId]);

  if (loading) return <div>Loading place...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
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
          Remove from Saved
        </button>
      </div>
    </div>
  );
}
