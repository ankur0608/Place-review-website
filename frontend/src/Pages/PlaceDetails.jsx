import { useEffect, useState, lazy, Suspense, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery as convexQuery, useMutation } from "convex/react";
import { useQuery as tanstackQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

import styles from "./PlaceDetails.module.css";
import { useTheme } from "../store/ThemeContext.jsx";
import ReviewForm from "../Components/Reviews.jsx";
import { api } from "../../../convex/_generated/api.js";
import heartFilled from "../../src/assets/heart.png";
import heartOutline from "../../src/assets/heart2.png";
import Loading from "../Components/Loading.jsx";
const PlacesSlider = lazy(() => import("../Components/Slider.jsx"));

// --- API Fetch ---
const fetchPlaceDetails = (id) =>
  fetch(`https://place-review-website-real.onrender.com/places/${id}`).then(
    (res) => res.json()
  );

export default function PlaceDetails() {
  const { id } = useParams();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const userId = localStorage.getItem("id");
  const userName = localStorage.getItem("username");

  // --- Auth Check ---
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      alert("You must be logged in to view this page.");
      navigate("/login");
    }
  }, [navigate]);

  // --- Fetch Place Data ---
  const {
    data: place,
    isLoading,
    error,
  } = tanstackQuery({
    queryKey: ["place", id],
    queryFn: () => fetchPlaceDetails(id),
    staleTime: 1000 * 60 * 5,
  });

  // --- Convex Data ---
  const toggleSave = useMutation(api.saveplace.toggle);
  const savedPlaces = convexQuery(
    api.saveplace.getSaved,
    userId ? { userId } : "skip"
  );
  const isSaved = savedPlaces?.some((p) => p.placeId === id);

  const reviews = convexQuery(
    api.reviews.list,
    place ? { placeId: String(id) } : "skip"
  );
  const addReview = useMutation(api.reviews.add);
  const updateReview = useMutation(api.reviews.update);
  const deleteReview = useMutation(api.reviews.remove);

  const userReview = reviews?.find((r) => r.userId === userId);
  const [editing, setEditing] = useState(false);

  // --- Review Handlers ---
  const handleReviewSubmit = async ({ comment, rating, photo }) => {
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
          photo,
        });
        setEditing(false);
      } else {
        await addReview({
          name: userName,
          comment,
          rating,
          photo,
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

  const handleSave = async () => {
    try {
      await toggleSave({ userId, placeId: id });
    } catch (err) {
      alert("Error saving place: " + err.message);
    }
  };

  // --- UI: Early returns ---
  if (isLoading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;
  if (!place) return <p>No place found.</p>;

  // --- UI Components ---
  const PlaceHeader = () => (
    <>
      <h1 className={styles.title}>{place.name}</h1>

      <img src={place.image} alt={place.name} className={styles.image} />
    </>
  );

  const PlaceInfo = () => (
    <div className={styles.detailsSection}>
      <p className={styles.info}>
        <strong className={styles.locationLabel}>Location: </strong>
        {place.location}
      </p>
      <p className={styles.description}>{place.description}</p>
    </div>
  );

  const SavePlaceButton = () => (
    <div
      className={`${styles.saveButton} ${isSaved ? styles.liked : ""}`}
      onClick={handleSave}
    >
      <img src={isSaved ? heartOutline : heartFilled} alt="heart icon" />
      <span>{isSaved ? "Saved" : "Save Place"}</span>
    </div>
  );

  const ReviewSection = () => (
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
            <strong>{userReview.name}</strong> rated it ⭐ {userReview.rating}/5
          </p>
          <p className={styles.comment}>{userReview.comment}</p>
          <button onClick={() => setEditing(true)}>Edit Review</button>
          <button onClick={handleDeleteReview} className={styles.deleteButton}>
            Delete Review
          </button>
        </div>
      )}
    </div>
  );

  const AllReviews = () =>
    reviews?.length > 0 && (
      <div className={styles.reviewsSection}>
        <h3>User Reviews</h3>
        {reviews.map((review) => (
          <div key={review._id} className={styles.reviewItem}>
            <p>
              <strong>{review.name}</strong> rated it ⭐ {review.rating}/5
              <span className={styles.timeAgo}>
                {review.createdAt &&
                  formatDistanceToNow(new Date(review.createdAt), {
                    addSuffix: true,
                  })}
              </span>
            </p>
            <p>{review.comment}</p>
            {review.photo && (
              <img
                src={review.photo}
                alt="Review"
                className={styles.reviewPhoto}
              />
            )}
          </div>
        ))}
      </div>
    );

  return (
    <>
      <div
        className={`${styles.container} ${theme === "dark" ? styles.dark : styles.light}`}
      >
        <div className={styles.topBar}>
          <Link to="/places">
            <button className={styles.backButton}>← Go Back</button>
          </Link>
        </div>

        <PlaceHeader />
        <PlaceInfo />
        <div className={styles.actions}>
          <SavePlaceButton />
        </div>

        <ReviewSection />
        <AllReviews />
      </div>

      <Suspense fallback={<div>Loading Places...</div>}>
        <PlacesSlider />
      </Suspense>
    </>
  );
}
