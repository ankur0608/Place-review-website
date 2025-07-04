import { useState } from "react";
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
  const {
    data: places,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["places"],
    queryFn: fetchPlaces,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const placesPerPage = 6;

  const { theme } = useTheme();

  const categories = [
    "All",
    ...new Set(places?.map((p) => p.category).filter(Boolean)),
  ];

  // Filtered data based on search and category
  const filteredPlaces = places?.filter((place) => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || place.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil((filteredPlaces?.length || 0) / placesPerPage);
  const paginatedPlaces = filteredPlaces?.slice(
    (currentPage - 1) * placesPerPage,
    currentPage * placesPerPage
  );

  // Reset to page 1 when filter changes
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

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
            onClick={() => handleCategoryChange(cat)}
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
          onChange={handleSearchChange}
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
        ) : paginatedPlaces?.length > 0 ? (
          paginatedPlaces.map((place) => (
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

      {/* Pagination Controls */}
      {filteredPlaces?.length > placesPerPage && (
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={styles.pageButton}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`${styles.pageButton} ${
                currentPage === idx + 1 ? styles.activePage : ""
              }`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={styles.pageButton}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
