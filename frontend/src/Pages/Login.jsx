import { useForm } from "react-hook-form";
import styles from "./Login.module.css";
import { useTheme } from "../store/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { TbLockPassword } from "react-icons/tb";
import { IoMailOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import SignInWithGoogle from "../Components/SignInWithGoogle";
export default function Login() {
  const { theme } = useTheme();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await fetch(
        "https://place-review-website-real.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        }
      );

      const result = await res.json();

      if (result.success) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("username", result.user.username);
        localStorage.setItem("email", result.user.email);
        localStorage.setItem("id", result.user.id);

        setShowSuccess(true);
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(result.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("🔴 Login error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email */}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <div className={styles.inputWrapper}>
              <IoMailOutline className={styles.inputIcon} />
              <input
                id="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                className={styles.inputField}
              />
            </div>
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.inputWrapper}>
              <TbLockPassword className={styles.inputIcon} />
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={styles.inputField}
              />
            </div>
            {errors.password && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
          </div>

          <div className={styles.forgotPasswordContainer}>
            <Link to="/forgot-password" className={styles.forgotPasswordLink}>
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className={styles.button}>
            Login
          </button>

          <div className={styles.sigupcontainer}>
            <Link to="/signup" className={styles.siguplink}>
              Don't have an account? Sign up
            </Link>
          </div>
          {/* OR Divider */}
          <div className={styles.dividerContainer}>
            <span className={styles.dividerLine}></span>
            <span className={styles.dividerText}>OR</span>
            <span className={styles.dividerLine}></span>
          </div>
          {/* Google Sign-In */}
          <div className={styles.googleContainer}>
            <SignInWithGoogle />
          </div>
        </form>
      </div>
    </div>
  );
}
