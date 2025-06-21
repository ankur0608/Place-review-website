import { useEffect, useState, lazy, Suspense } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./PlaceDetails.module.css";
import { useTheme } from "../store/ThemeContext.jsx";
import ReviewForm from "../Components/Reviews.jsx";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const PlaceSlider = lazy(() => import("../Components/PlacesSlider.jsx"));

export default function PlaceDetails() {
  const { id } = useParams();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔒 Check login before loading place
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to view this page.");
      navigate("/login");
    }
  }, [navigate]);

  const reviews = useQuery(
    api.reviews.list,
    place ? { placeId: String(id) } : "skip"
  );

  const addReview = useMutation(api.reviews.add);

  async function handleReviewSubmit(reviewData) {
    try {
      await addReview({
        ...reviewData,
        placeId: String(id),
        placeName: place.name,
      });
    } catch (err) {
      alert("Error submitting review: " + err.message);
    }
  }

  useEffect(() => {
    async function fetchPlace() {
      try {
        const response = await fetch(`https://place-review-website-real.onrender.com/places/${id}`);
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
        <h1 className={styles.title}>{place.name}</h1>
        <img src={place.image} alt={place.name} className={styles.image} />
        <p className={styles.info}>
          <strong className={styles.locationLabel}>Location:</strong>
          {place.location}
        </p>
        <p className={styles.description}>{place.description}</p>

        <ReviewForm onSubmit={handleReviewSubmit} />

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

        <Link to="/places">
          <button className={styles.button}>Go Back</button>
        </Link>
      </div>

      <Suspense fallback={<div>Loading Places...</div>}>
        <PlaceSlider />
      </Suspense>
    </>
  );
}
