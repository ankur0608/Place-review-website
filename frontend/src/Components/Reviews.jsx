import { Rating } from "react-simple-star-rating";
import { useForm } from "react-hook-form";
import { useState } from "react";
import styles from "./Review.module.css";
import { useTheme } from "../store/ThemeContext";

export default function Review({ onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [rating, setRating] = useState(0);
  const { theme } = useTheme();

  function onFormSubmit(data) {
    if (rating === 0) return alert("Please select a rating.");

    const finalRating = rating;

    onSubmit({ ...data, rating: finalRating });
    setRating(0);
    reset();
  }

  function handleRatingChange(value) {
    setRating(value);
  }

  return (
    <div className={`${styles.review} ${styles[theme]}`}>
      <h3>Write a Review</h3>

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
        <input
          type="text"
          placeholder="Your name"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && <p className={styles.error}>{errors.name.message}</p>}

        <textarea
          placeholder="Write your review..."
          {...register("comment", { required: "Comment is required" })}
        />
        {errors.comment && (
          <p className={styles.error}>{errors.comment.message}</p>
        )}

        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
}
