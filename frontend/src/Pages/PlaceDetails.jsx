import { useEffect, useState, lazy, Suspense, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { useQuery as TanstackUseQuery } from "@tanstack/react-query";
import styles from "./PlaceDetails.module.css";
import { useTheme } from "../store/ThemeContext.jsx";
import ReviewForm from "../Components/Reviews.jsx";
import { api } from "../../convex/_generated/api";
import heartFilled from "../../src/assets/heart.png";
import heartOutline from "../../src/assets/heart2.png";
const PlacesSlider = lazy(() => import("../Components/Slider.jsx"));

function fetchPlaceDetails(id) {
  return fetch(
    `https://place-review-website-real.onrender.com/places/${id}`
  ).then((res) => res.json());
}

export default function PlaceDetails() {
  const { id } = useParams();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("id");
  const userName = localStorage.getItem("username");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to view this page.");
      navigate("/login");
    }
  }, [navigate]);

  const {
    data: placeData,
    isLoading,
    error: fetchError,
  } = TanstackUseQuery({
    queryKey: ["place", id],
    queryFn: () => fetchPlaceDetails(id),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (placeData) {
      setPlace(placeData);
      setLoading(false);
    }
  }, [placeData]);

  useEffect(() => {
    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
    }
  }, [fetchError]);

  const toggleSave = useMutation(api.saveplace.toggle);
  const savedPlaces = useQuery(
    api.saveplace.getSaved,
    userId ? { userId } : "skip"
  );
  const isSaved = savedPlaces?.some((p) => p.placeId === id);

  async function handleSave() {
    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }
    try {
      await toggleSave({ userId, placeId: id });
    } catch (err) {
      alert("Error saving place: " + err.message);
    }
  }

  const reviews = useQuery(
    api.reviews.list,
    place ? { placeId: String(id) } : "skip"
  );
  const addReview = useMutation(api.reviews.add);
  const updateReview = useMutation(api.reviews.update);
  const deleteReview = useMutation(api.reviews.remove);

  const userReview = reviews?.find((r) => r.userId === userId);
  const [editing, setEditing] = useState(false);

  const handleReviewSubmit = async ({ comment, rating }) => {
    if (!comment.trim() || rating <= 0) {
      alert("Please enter a valid comment and rating.");
      return;
    }

    try {
      if (userReview && editing) {
        await updateReview({
          reviewId: userReview._id,
          comment,
          rating,
        });
        setEditing(false);
      } else {
        await addReview({
          name: userName,
          comment,
          rating,
          placeId: String(id),
          placeName: place.name,
          userId,
        });
      }
    } catch (err) {
      alert("Error submitting review: " + err.message);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;
    if (!window.confirm("Are you sure you want to delete your review?")) return;
    try {
      await deleteReview({ reviewId: userReview._id });
      setEditing(false);
    } catch (err) {
      alert("Error deleting review: " + err.message);
    }
  };

  if (loading || isLoading) return <p>Loading...</p>;
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

        <div className={styles.detailsSection}>
          <p className={styles.info}>
            <strong className={styles.locationLabel}>Location:</strong>{" "}
            {place.location}
          </p>
          <p className={styles.description}>{place.description}</p>
        </div>

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

        <div className={styles.reviewFormWrapper}>
          <h3 className={styles.sectionTitle}>
            {userReview ? "Your Review" : "Give a Review"}
          </h3>

          {!userReview || editing ? (
            <ReviewForm
              onSubmit={handleReviewSubmit}
              initialComment={userReview?.comment || ""}
              initialRating={userReview?.rating || 0}
              isEditing={editing}
              onCancel={() => setEditing(false)}
            />
          ) : (
            <div className={styles.reviewItem}>
              <p>
                <strong>{userReview.name}</strong> rated it ⭐{" "}
                {userReview.rating}/5
              </p>
              <p>{userReview.comment}</p>
              <button onClick={() => setEditing(true)}>Edit Review</button>
              <button
                onClick={handleDeleteReview}
                style={{ marginLeft: 8, color: "red" }}
              >
                Delete Review
              </button>
            </div>
          )}
        </div>

        {reviews?.length > 0 && (
          <div className={styles.reviewsSection}>
            <h3>User Reviews</h3>
            {reviews.map((review) => (
              <div key={review._id} className={styles.reviewItem}>
                <p>
                  <strong>{review.name}</strong> rated it ⭐ {review.rating}/5
                </p>
                <p>{review.comment}</p>
                {review.userId === userId && !userReview && (
                  <div>
                    <button onClick={() => setEditing(true)}>Edit</button>
                    <button
                      onClick={handleDeleteReview}
                      style={{ marginLeft: 8, color: "red" }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Suspense fallback={<div>Loading Places...</div>}>
        <PlacesSlider />
      </Suspense>
    </>
  );
}
