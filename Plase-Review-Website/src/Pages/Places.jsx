import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // <-- Import Link
import styles from "./Places.module.css";

export default function Places() {
  const [places, setPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchPlaces() {
      try {
        const response = await fetch("http://localhost:5000/places");
        if (!response.ok) throw new Error("Failed to fetch places.");
        const data = await response.json();
        setPlaces(data);
      } catch (error) {
        console.error("Error fetching places:", error.message);
      }
    }

    fetchPlaces();
  }, []);

  const filteredPlaces = places.filter((place) => {
    const query = searchQuery.toLowerCase();
    return (
      place.name.toLowerCase().includes(query) ||
      place.location.toLowerCase().includes(query)
    );
  });

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.heading}>All Places</h1>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search Places"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className={styles.clearButton}
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className={styles.cardGrid}>
        {filteredPlaces.map((place) => (
          <Link
            key={place.id}
            to={`/places/${place.id}`} // <-- Link to detail page
            className={styles.cardLink} // Add styling to remove default link styles
          >
            <div className={styles.card}>
              <img
                src={place.image}
                alt={place.name}
                className={styles.image}
              />
              <div className={styles.cardContent}>
                <h2 className={styles.name}>{place.name}</h2>
                <p className={styles.location}>{place.location}</p>
                {/* <p className={styles.description}>{place.description}</p> */}
              </div>
            </div>
          </Link>
        ))}
        {filteredPlaces.length === 0 && (
          <p className={styles.noResults}>No places found.</p>
        )}
      </div>
    </div>
  );
}
