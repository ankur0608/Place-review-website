import { useForm } from "react-hook-form";
import styles from "./Contact.module.css";
import { useTheme } from "../store/ThemeContext";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useState } from "react";

const Contact = () => {
  const { theme } = useTheme();
  const insertContact = useMutation(api.contact.insertContact);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const onSubmit = async (data) => {
    if (!token) {
      alert("❌ Please log in to send a message.");
      return;
    }

    try {
      // Save to backend (optional)
      await fetch("https://place-review-website-real.onrender.com/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // Save to Convex
      await insertContact(data);

      alert("✅ Message sent successfully!");
      reset(); // clear form
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("❌ Something went wrong. Try again later.");
    }
  };

  return (
    <div
      className={`${styles.container} ${
        theme === "dark" ? styles.dark : styles.light
      }`}
    >
      <div className={styles.card}>
        <h2 className={styles.heading}>Contact Us</h2>
        <p className={styles.subtext}>
          Have a question, suggestion, or feedback? We’d love to hear from you!
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Name */}
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              className={styles.inputField}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className={styles.error}>{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={styles.inputField}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
          </div>

          {/* Message */}
          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.label}>
              Message
            </label>
            <textarea
              id="message"
              placeholder="Write your message here..."
              className={styles.textarea}
              {...register("message", { required: "Message is required" })}
            />
            {errors.message && (
              <p className={styles.error}>{errors.message.message}</p>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className={styles.button}>
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
