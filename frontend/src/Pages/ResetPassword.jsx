import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import styles from "./ResetPassword.module.css";
import { useTheme } from "../store/ThemeContext";
import { IoLockClosedOutline } from "react-icons/io5";

const ResetPassword = () => {
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");

  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log("🔐 Submitting reset with token:", token);
      const res = await axios.post(
        "https://place-review-website-real.onrender.comforgot-password/reset-password",
        {
          token,
          newPassword: data.password,
        }
      );

      if (res.status === 200) {
        setMessage("✅ Password reset successfully! You can now log in.");
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("❌ Reset failed:", error);
      setMessage(
        error?.response?.data?.message || "❌ Error resetting password."
      );
    }
  };

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Reset Password</h2>
        <p className={styles.subtext}>
          Enter your new password below to reset it.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              New Password
            </label>
            <div className={styles.inputWrapper}>
              <IoLockClosedOutline className={styles.inputIcon} />
              <input
                id="password"
                type="password"
                placeholder="Enter new password"
                className={styles.inputField}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
            </div>
            {errors.password && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password
            </label>
            <div className={styles.inputWrapper}>
              <IoLockClosedOutline className={styles.inputIcon} />
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                className={styles.inputField}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
              />
            </div>
            {errors.confirmPassword && (
              <p className={styles.error}>{errors.confirmPassword.message}</p>
            )}
          </div>

          <button type="submit" className={styles.button}>
            Reset Password
          </button>
        </form>

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
