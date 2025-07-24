import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Rating } from "react-simple-star-rating";
import styles from "./Reviews.module.css";
import { useTheme } from "../store/ThemeContext";

const ReviewForm = ({ placeId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const user_id = localStorage.getItem("id");
  const name = localStorage.getItem("username");

  const { theme } = useTheme();

  const handleRating = (rate) => setRating(rate);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) setPhotoPreview(URL.createObjectURL(file));
  };

  const clearPhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment || !rating || !user_id || !name) {
      toast.error("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("comment", comment);
    formData.append("rating", rating);
    formData.append("photo", photo);
    formData.append("place_id", placeId);
    formData.append("user_id", user_id);
    formData.append("name", name);

    try {
      const res = await axios.post(
        "https://place-review-website-real.onrender.com//api/reviews",
        formData
      );
      if (res.data.success) {
        toast.success("Review submitted!");
        setComment("");
        setRating(0);
        clearPhoto();

        if (onReviewAdded) onReviewAdded(); // ✅ Trigger parent to refetch reviews
      } else {
        toast.error("Failed to submit review.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${styles.reviewForm} ${
        theme === "dark" ? styles.dark : styles.light
      }`}
    >
      <h2 className={styles.heading}>Leave a Review</h2>

      <div className={styles.formGroup}>
        <label>Rating</label>
        <Rating
          onClick={handleRating}
          initialValue={rating}
          allowFraction
          size={24}
          transition
        />
      </div>

      <div className={styles.formGroup}>
        <label>Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Share your experience..."
          className={styles.textarea}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="photo-upload" className={styles.customFileInput}>
          {photo ? "Change Photo" : "Select Photo"}
        </label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className={styles.hiddenInput}
        />
        {photoPreview && (
          <div className={styles.previewWrapper}>
            <img
              src={photoPreview}
              alt="Preview"
              className={styles.previewImage}
            />
            <button
              type="button"
              onClick={clearPhoto}
              className={styles.removeButton}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <button type="submit" className={styles.submitButton}>
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
