import { useForm } from "react-hook-form";
import styles from "./Contact.module.css";
import { useTheme } from "../store/ThemeContext";

const Contact = () => {
  const { theme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Contact Form Data:", data);
    // Optionally send to API
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
