import { Rating } from "react-simple-star-rating";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import styles from "./Review.module.css";
import { useTheme } from "../store/ThemeContext";

export default function Review({
  onSubmit,
  initialComment = "",
  initialRating = 0,
  isEditing = false,
  onCancel,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();

  const [rating, setRating] = useState(initialRating);
  const [photo, setPhoto] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    setValue("comment", initialComment);
    setRating(initialRating);
  }, [initialComment, initialRating, setValue]);

  function onFormSubmit(data) {
    if (rating === 0) return alert("Please select a rating.");
    onSubmit({ comment: data.comment, rating, photo: photo ?? undefined });
    reset();
    setRating(0);
    setPhoto(null);
  }

  function handleRatingChange(value) {
    setRating(value);
  }

  // Convert image to base64
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return setPhoto(null);
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className={`${styles.review} ${styles[theme]}`}>
      <h3>{isEditing ? "Edit Your Review" : "Write a Review"}</h3>
      <div>
        <Rating
          onClick={handleRatingChange}
          ratingValue={rating}
          allowHalfIcon
          size={25}
          transition
        />
      </div>
      <form onSubmit={handleSubmit(onFormSubmit)} className={styles.form}>
        <textarea
          className={styles.textarea}
          placeholder="Write your review..."
          {...register("comment", { required: "Comment is required" })}
        />
        {errors.comment && (
          <p className={styles.error}>{errors.comment.message}</p>
        )}
        {/* Add image upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          style={{ margin: "8px 0" }}
        />
        {photo && (
          <img
            src={photo}
            alt="Preview"
            style={{ maxWidth: 80, marginTop: 8 }}
          />
        )}
        <button type="submit">
          {isEditing ? "Update Review" : "Submit Review"}
        </button>
        {isEditing && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}
