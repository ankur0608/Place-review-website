// PlaceDetails.jsx
import { useEffect, useState, lazy, Suspense } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

import styles from "./PlaceDetails.module.css";
import { useTheme } from "../store/ThemeContext.jsx";
import ReviewForm from "../Components/Reviews.jsx";
import supabase from "/lib/supabaseClient"; 
import heartFilled from "../../src/assets/heart.png";
import heartOutline from "../../src/assets/heart2.png";
import Loading from "../Components/Loading.jsx";
const PlacesSlider = lazy(() => import("../Components/Slider.jsx"));

// --- API Fetch ---
const fetchPlaceDetails = async (id) => {
  const res = await fetch(`https://place-review-website-real.onrender.com/api/places/${id}`);
  if (!res.ok) throw new Error("Failed to fetch place");
  return res.json();
};

export default function PlaceDetails() {
  const { id } = useParams();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const userId = localStorage.getItem("id");
  const userName = localStorage.getItem("username");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      alert("You must be logged in to view this page.");
      navigate("/login");
    }
  }, [navigate]);

  const {
    data: place,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["place", id],
    queryFn: () => fetchPlaceDetails(id),
    staleTime: 1000 * 60 * 5,
  });

  const { data: reviews = [], refetch: refetchReviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("placeId", id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: saved = [], refetch: refetchSaved } = useQuery({
    queryKey: ["savedPlaces", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("saved_places")
        .select("*")
        .eq("userId", userId);
      if (error) throw error;
      return data;
    },
  });

  const isSaved = saved?.some((p) => p.placeId === id);
  const userReview = reviews?.find((r) => r.userId === userId);
  const [editing, setEditing] = useState(false);

  const handleSave = async () => {
    try {
      if (isSaved) {
        await supabase
          .from("saved_places")
          .delete()
          .eq("userId", userId)
          .eq("placeId", id);
      } else {
        await supabase.from("saved_places").insert([{ userId, placeId: id }]);
      }
      refetchSaved();
    } catch (err) {
      alert("Error toggling save: " + err.message);
    }
  };

  const handleReviewSubmit = async ({ comment, rating, photo }) => {
    if (!comment.trim() || rating <= 0) {
      alert("Please enter a valid comment and rating.");
      return;
    }

    try {
      if (userReview && editing) {
        await supabase
          .from("reviews")
          .update({ comment, rating, photo })
          .eq("id", userReview.id);
        setEditing(false);
      } else {
        await supabase.from("reviews").insert([
          {
            name: userName,
            comment,
            rating,
            photo,
            placeId: id,
            userId,
          },
        ]);
      }
      refetchReviews();
    } catch (err) {
      alert("Error submitting review: " + err.message);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;
    if (!window.confirm("Are you sure you want to delete your review?")) return;

    try {
      await supabase.from("reviews").delete().eq("id", userReview.id);
      setEditing(false);
      refetchReviews();
    } catch (err) {
      alert("Error deleting review: " + err.message);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;
  if (!place) return <p>No place found.</p>;

  return (
    <>
      <div className={`${styles.container} ${theme === "dark" ? styles.dark : styles.light}`}>
        <div className={styles.topBar}>
          <Link to="/places">
            <button className={styles.backButton}>← Go Back</button>
          </Link>
        </div>

        <h1 className={styles.title}>{place.name}</h1>
        <img src={place.image} alt={place.name} className={styles.image} />

        <div className={styles.detailsSection}>
          <p className={styles.info}>
            <strong>Location:</strong> {place.location}
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

        {reviews?.length > 0 && (
          <div className={styles.reviewsSection}>
            <h3>User Reviews</h3>
            {reviews.map((review) => (
              <div key={review.id} className={styles.reviewItem}>
                <p>
                  <strong>{review.name}</strong> rated it ⭐ {review.rating}/5
                  <span className={styles.timeAgo}>
                    {review.created_at &&
                      formatDistanceToNow(new Date(review.created_at), {
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
        )}
      </div>

      <Suspense fallback={<div>Loading Places...</div>}>
        <PlacesSlider />
      </Suspense>
    </>
  );
}
