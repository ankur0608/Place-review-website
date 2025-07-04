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
  const { theme } = useTheme();

  useEffect(() => {
    setValue("comment", initialComment);
    setRating(initialRating);
  }, [initialComment, initialRating, setValue]);

  function onFormSubmit(data) {
    if (rating === 0) return alert("Please select a rating.");
    onSubmit({ comment: data.comment, rating });
    reset();
    setRating(0);
  }

  function handleRatingChange(value) {
    setRating(value);
  }

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
