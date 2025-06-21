import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Places.module.css";
import { useTheme } from "../store/ThemeContext";

export default function Places() {
  const [places, setPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { theme } = useTheme();

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

  const categories = [
    "All",
    ...new Set(places.map((p) => p.category).filter(Boolean)),
  ];

  const filteredPlaces = places.filter((place) => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || place.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <h1 className={styles.heading}>Explore Tourist Places</h1>

      {/* Category Tabs */}
      <div className={styles.categoryTabs}>
        {categories.map(
          (cat, index) =>
            cat && (
              <button
                key={`${cat}-${index}`}
                className={`${styles.tabButton} ${
                  selectedCategory === cat ? styles.activeTab : ""
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {` ${cat} `}
              </button>
            )
        )}
      </div>

      {/* Search Bar */}
      <div className={styles.searchWrapper}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by name or location..."
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

      {/* Cards */}
      <div className={styles.cardGrid}>
        {filteredPlaces.map((place) => (
          <Link
            key={place.id}
            to={`/places/${place.id}`}
            className={styles.cardLink}
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
