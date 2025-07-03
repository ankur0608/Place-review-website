import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Places.module.css";
import { useTheme } from "../store/ThemeContext";
import Loding from "../Components/Loading.jsx";
import { useQuery } from "@tanstack/react-query";

function fetchPlaces() {
  return fetch("https://place-review-website-real.onrender.com/places").then(
    (res) => res.json()
  );
}

export default function Places() {
  const { data: places, isLoading, error } = useQuery({
    queryKey: ["places"],
    queryFn: fetchPlaces,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { theme } = useTheme();

  const categories = [
    "All",
    ...new Set(places?.map((p) => p.category).filter(Boolean)),
  ];

  const filteredPlaces = places?.filter((place) => {
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
        {categories.map((cat, index) => (
          <button
            key={`${cat}-${index}`}
            className={`${styles.tabButton} ${
              selectedCategory === cat ? styles.activeTab : ""
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
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

      {/* Cards OR Loading Spinner */}
      <div className={styles.cardGrid}>
        {isLoading ? (
          <Loding />
        ) : filteredPlaces?.length > 0 ? (
          filteredPlaces.map((place) => (
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
          ))
        ) : (
          <p className={styles.noResults}>No places found.</p>
        )}
      </div>
    </div>
  );
}
