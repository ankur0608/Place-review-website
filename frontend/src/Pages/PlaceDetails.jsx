import { useEffect, useState, lazy, Suspense } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import styles from "./PlaceDetails.module.css";
import { useTheme } from "../store/ThemeContext.jsx";
import ReviewForm from "../Components/Reviews.jsx";
import { api } from "../../convex/_generated/api";
import heartFilled from "../../src/assets/heart.png";
import heartOutline from "../../src/assets/heart2.png";

import PlacesSlider from "../Components/PlacesSlider.jsx";

export default function PlaceDetails() {
  const { id } = useParams();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get userId from localStorage
  const userId = localStorage.getItem("id");
  console.log("✅ userId:", userId);

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to view this page.");
      navigate("/login");
    }
  }, [navigate]);

  // Fetch place data from backend
  useEffect(() => {
    async function fetchPlace() {
      try {
        const response = await fetch(
          `https://place-review-website-real.onrender.com/places/${id}`
        );
        if (!response.ok) throw new Error("Place not found");
        const data = await response.json();
        setPlace(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPlace();
  }, [id]);

  // Convex queries and mutations
  const toggleSave = useMutation(api.saveplace.toggle);
  const savedPlaces = useQuery(
    api.saveplace.getSaved,
    userId ? { userId } : "skip"
  );
  const isSaved = savedPlaces?.some((p) => p.placeId === id);

  // Handle save toggle
  async function handleSave() {
    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }
    try {
      console.log("🖱️ Saving/un-saving place:", { userId, placeId: id });
      await toggleSave({ userId, placeId: id });
    } catch (err) {
      alert("Error saving place: " + err.message);
    }
  }

  // Reviews
  const reviews = useQuery(
    api.reviews.list,
    place ? { placeId: String(id) } : "skip"
  );
  const addReview = useMutation(api.reviews.add);

  const handleReviewSubmit = async (reviewData) => {
    try {
      await addReview({
        ...reviewData,
        placeId: String(id),
        placeName: place.name,
      });
    } catch (err) {
      alert("Error submitting review: " + err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!place) return <p>No place found.</p>;

  return (
    <>
      <div
        className={`${styles.container} ${
          theme === "dark" ? styles.dark : styles.light
        }`}
      >
        {/* Title */}
        <h1 className={styles.title}>{place.name}</h1>

        {/* Image */}
        <img src={place.image} alt={place.name} className={styles.image} />

        {/* Info */}
        <div className={styles.detailsSection}>
          <p className={styles.info}>
            <strong className={styles.locationLabel}>Location:</strong>{" "}
            {place.location}
          </p>
          <p className={styles.description}>{place.description}</p>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <div
            className={`${styles.saveButton} ${isSaved ? styles.liked : ""}`}
            onClick={handleSave}
          >
            <img src={isSaved ? heartOutline : heartFilled} alt="heart icon" />
            <span>{isSaved ? "Saved" : "Save Place"}</span>
          </div>

          <Link to="/places">
            <button className={styles.button}>Go Back</button>
          </Link>
        </div>

        {/* Review Form */}
        <div className={styles.reviewFormWrapper}>
          <h3 className={styles.sectionTitle}>Give a Review</h3>
          <ReviewForm onSubmit={handleReviewSubmit} />
        </div>

        {/* Reviews */}
        {reviews?.length > 0 && (
          <div className={styles.reviewsSection}>
            <h3>User Reviews</h3>
            {reviews.map((review) => (
              <div key={review._id} className={styles.reviewItem}>
                <p>
                  <strong>{review.name}</strong> rated it ⭐ {review.rating}/5
                </p>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Slider */}
      <Suspense fallback={<div>Loading Places...</div>}>
        <PlacesSlider />
      </Suspense>
    </>
  );
}
