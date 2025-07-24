import { useEffect, useState, lazy, Suspense, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Rating } from "react-simple-star-rating";

import styles from "./PlaceDetails.module.css";
import { useTheme } from "../store/ThemeContext.jsx";
import ReviewForm from "../Components/ReviewForm";
import supabase from "/lib/supabaseClient";
import heartFilled from "../../src/assets/heart.png";
import heartOutline from "../../src/assets/heart2.png";
import Loading from "../Components/Loading.jsx";
import { HiDotsVertical } from "react-icons/hi";

const PlacesSlider = lazy(() => import("../Components/Slider.jsx"));

const fetchPlaceDetails = async (id) => {
  const res = await fetch(
    `https://place-review-website-real.onrender.com/api/places/${id}`
  );
  if (!res.ok) throw new Error("Failed to fetch place");
  return res.json();
};

export default function PlaceDetails() {
  const { id } = useParams();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeMenu, setActiveMenu] = useState(null);
  const dropdownRef = useRef(null);
  const [editing, setEditing] = useState(false);

  const userId = localStorage.getItem("id");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      alert("You must be logged in to view this page.");
      navigate("/login");
    }
  }, [navigate]);

  const toggleMenu = (reviewId) => {
    setActiveMenu((prev) => (prev === reviewId ? null : reviewId));
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete your review?")) return;
    try {
      await supabase.from("reviews").delete().eq("id", reviewId);
      refetchReviews();
    } catch (err) {
      alert("Error deleting review: " + err.message);
    }
  };

  // const handleEdit = (review) => {
  //   setEditing(true);
  //   // Editing logic is passed via ReviewForm
  // };

  const {
    data: place,
    isLoading: placeLoading,
    error: placeError,
  } = useQuery({
    queryKey: ["place", id],
    queryFn: () => fetchPlaceDetails(id),
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: reviews = [],
    refetch: refetchReviews,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("place_id", id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const {
    data: saved = [],
    refetch: refetchSaved,
    isLoading: savedLoading,
    error: savedError,
  } = useQuery({
    queryKey: ["savedPlaces", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("savedplaces")
        .select("*")
        .eq("user_id", userId);
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const isSaved = saved?.some((p) => p.place_id === id);
  const userReview = reviews?.find((r) => r.user_id === userId);

  const handleSave = async () => {
    if (!userId) {
      alert("You must be logged in to save a place.");
      return;
    }

    try {
      if (isSaved) {
        const { error } = await supabase
          .from("savedplaces")
          .delete()
          .eq("user_id", userId)
          .eq("place_id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("savedplaces")
          .insert([{ user_id: userId, place_id: id }]);
        if (error) throw error;
      }
      await refetchSaved();
    } catch (err) {
      alert("Error toggling save: " + err.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (placeLoading) return <Loading />;
  if (placeError) return <p>Error: {placeError.message}</p>;
  if (!place) return <p>No place found.</p>;

  return (
    <>
      <div
        className={`${styles.container} ${
          theme === "dark" ? styles.dark : styles.light
        }`}
      >
        <div className={styles.topBar}>
          <Link to="/places">
            <button className={styles.backButton}>← Go Back</button>
          </Link>

          <div
            className={`${styles.saveButton} ${isSaved ? styles.liked : ""} ${
              savedLoading ? styles.disabled : ""
            }`}
            onClick={savedLoading ? undefined : handleSave}
            title={isSaved ? "Unsave Place" : "Save Place"}
            style={{ cursor: savedLoading ? "not-allowed" : "pointer" }}
          >
            <img src={isSaved ? heartOutline : heartFilled} alt="heart icon" />
          </div>
        </div>

        <h1 className={styles.title}>{place.name}</h1>
        <img
          src={place.image_url || "/placeholder.jpg"}
          alt={place.name}
          className={styles.image}
          loading="lazy"
        />

        <div className={styles.detailsSection}>
          <p className={styles.info}>
            <strong>Location:</strong> {place.location}
          </p>
          <p className={styles.description}>{place.description}</p>
        </div>

        <div className={styles.reviewFormWrapper}>
          <ReviewForm placeId={id} onReviewAdded={refetchReviews} />
        </div>

        {reviewsLoading && <Loading />}
        {reviewsError && <p>Error loading reviews: {reviewsError.message}</p>}
        {reviews.length === 0 ? (
          <div className={styles.reviewsSection}>
            <h3 className={styles.sectionTitle}>Reviews</h3>
            <p>No reviews yet</p>
          </div>
        ) : (
          <div className={styles.reviewsSection}>
            {/* <h3 className={styles.sectionTitle}>Reviews</h3> */}
            {reviews.map((review) => (
              <div key={review.id} className={styles.reviewItem}>
                <div className={styles.reviewTop}>
                  <div>
                    <strong>{review.name}</strong>{" "}
                    <span className={styles.timeAgo}>
                      •{" "}
                      {formatDistanceToNow(new Date(review.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  {review.user_id === userId && (
                    <div className={styles.menuWrapper}>
                      <button
                        className={styles.menuButton}
                        onClick={() => toggleMenu(review.id)}
                      >
                        <HiDotsVertical />
                      </button>
                      {activeMenu === review.id && (
                        <div className={styles.menuDropdown} ref={dropdownRef}>
                          {/* <button onClick={() => handleEdit(review)}>
                            Edit
                          </button> */}
                          <button onClick={() => handleDelete(review.id)}>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className={styles.reviewContent}>
                  <div className={styles.reviewLeft}>
                    <Rating
                      readonly
                      initialValue={review.rating}
                      size={18}
                      allowFraction
                    />
                    <p className={styles.comment}>{review.comment}</p>
                  </div>

                  <div className={styles.reviewImageWrapper}>
                    {review.photo && (
                      <img
                        src={review.photo}
                        alt="Review"
                        className={styles.reviewPhoto}
                        loading="lazy"
                      />
                    )}
                  </div>
                </div>
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
