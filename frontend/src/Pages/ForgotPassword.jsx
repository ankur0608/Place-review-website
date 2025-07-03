import { useForm } from "react-hook-form";
import styles from "./ForgotPassword.module.css";
import { useTheme } from "../store/ThemeContext";
import { IoMailOutline } from "react-icons/io5";
import axios from "axios";
import { useState } from "react";

const ForgotPassword = () => {
  const { theme } = useTheme();
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log("📧 Submitting email:", data.email);
      const res = await axios.post(
        "https://place-review-website-real.onrender.comforgot-password/request-password-reset",
        { email: data.email }
      );

      if (res.status === 200) {
        setMessage("✅ Reset link sent! Check your email.");
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("❌ Error sending reset link:", error);
      setMessage(
        error?.response?.data?.message || "❌ Failed to send reset link."
      );
    }
  };

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Forgot Password</h2>
        <p className={styles.subtext}>
          Enter your email and we’ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <div className={styles.inputWrapper}>
              <IoMailOutline className={styles.inputIcon} />
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
            </div>
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
          </div>

          <button type="submit" className={styles.button}>
            Send Reset Link
          </button>
        </form>

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
