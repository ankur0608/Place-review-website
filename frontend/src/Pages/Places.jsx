import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import styles from "./Places.module.css";
import { useTheme } from "../store/ThemeContext";
import React from "react";

function fetchPlaces() {
  return fetch(
    "https://place-review-website-real.onrender.com/api/places"
  ).then((res) => res.json());
}

// Memoized Place Card
const PlaceCard = React.memo(({ place }) => (
  <Link
    key={place.id}
    to={`/places/${place.id}`}
    className={styles.cardLink}
    aria-label={`View details for ${place.name}`}
  >
    <article className={styles.card}>
      <img
        src={place.image_url || "/placeholder.jpg"}
        alt={place.name}
        className={styles.image}
        loading="lazy"
        width={250}
        height={160}
      />
      <div className={styles.cardContent}>
        <h2 className={styles.name}>{place.name}</h2>
        <p className={styles.location}>{place.location}</p>
      </div>
    </article>
  </Link>
));

export default function Places() {
  const { data: places, isLoading } = useQuery({
    queryKey: ["places"],
    queryFn: fetchPlaces,
    staleTime: 1000 * 60 * 5,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const placesPerPage = 6;
  const { theme } = useTheme();

  // Derive unique categories from data
  const categories = useMemo(() => {
    return ["All", ...new Set(places?.map((p) => p.category).filter(Boolean))];
  }, [places]);

  // Filtered and paginated data
  const filteredPlaces = useMemo(() => {
    return places?.filter((place) => {
      const name = place.name?.toLowerCase() || "";
      const location = place.location?.toLowerCase() || "";
      const matchesSearch =
        name.includes(searchQuery.toLowerCase()) ||
        location.includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || place.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [places, searchQuery, selectedCategory]);

  const totalPages = Math.ceil((filteredPlaces?.length || 0) / placesPerPage);

  const paginatedPlaces = useMemo(() => {
    return filteredPlaces?.slice(
      (currentPage - 1) * placesPerPage,
      currentPage * placesPerPage
    );
  }, [filteredPlaces, currentPage]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <main className={`${styles.container} ${styles[theme]}`}>
      <h1 className={styles.heading}>Explore Tourist Places</h1>

      <section aria-label="Category Filters" className={styles.categoryTabs}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.tabButton} ${
              selectedCategory === cat ? styles.activeTab : ""
            }`}
            onClick={() => handleCategoryChange(cat)}
            aria-pressed={selectedCategory === cat}
          >
            {cat}
          </button>
        ))}
      </section>

      <section aria-label="Search Bar" className={styles.searchWrapper}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search by name or location..."
          value={searchQuery}
          onChange={handleSearchChange}
          aria-label="Search places"
        />
        {/* {searchQuery && (
          <button
            className={styles.clearButton}
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
          >
            ×
          </button>
        )} */}
      </section>

      <section className={styles.cardGrid} aria-label="Places List">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.card}>
              <Skeleton height={160} className={styles.image} />
              <div className={styles.cardContent}>
                <h2>
                  <Skeleton width={120} />
                </h2>
                <p>
                  <Skeleton width={80} />
                </p>
              </div>
            </div>
          ))
        ) : paginatedPlaces?.length > 0 ? (
          paginatedPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))
        ) : (
          <p className={styles.noResults}>No places found.</p>
        )}
      </section>

      {filteredPlaces?.length > placesPerPage && (
        <nav className={styles.pagination} aria-label="Pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={styles.pageButton}
            aria-label="Previous page"
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
              aria-current={currentPage === idx + 1 ? "page" : undefined}
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
            aria-label="Next page"
          >
            Next
          </button>
        </nav>
      )}
    </main>
  );
}
