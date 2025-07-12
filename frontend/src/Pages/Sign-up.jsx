import { useForm } from "react-hook-form";
import styles from "./Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../store/ThemeContext";
import { FaRegUser } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";
import { IoMailOutline } from "react-icons/io5";

export default function Signup() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Signup.jsx (in onSubmit)
  async function onSubmit(data) {
    try {
      const res = await fetch(
        "https://place-review-website-real.onrender.com/api/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: data.username,
            email: data.email,
            password: data.password,
          }),
        }
      );

      const result = await res.json();

      if (res.status === 409) {
        alert("User already exists. Please log in instead.");
        return;
      }

      if (!res.ok) throw new Error(result.message || "Signup failed");

      alert("Signup successful!");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      alert(err.message || "Signup failed. Please try again.");
    }
  }

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Sign Up</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Username */}
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <div className={styles.inputWrapper}>
              <FaRegUser className={styles.inputIcon} />
              <input
                id="username"
                placeholder="Enter your username"
                {...register("username", {
                  required: "Username is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Username should contain alphabets only",
                  },
                  validate: (value) =>
                    !/\d/.test(value) || "Username should not contain numbers",
                })}
                className={styles.inputField}
              />
            </div>
            {errors.username && (
              <p className={styles.error}>{errors.username.message}</p>
            )}
          </div>

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
                    value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                    message: "Only @gmail.com emails are allowed",
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
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  maxLength: {
                    value: 15,
                    message: "Password must be at most 15 characters",
                  },
                  validate: (value) => {
                    if (!/[A-Z]/.test(value))
                      return "Must have at least 1 uppercase letter";
                    if (!/[a-z]/.test(value))
                      return "Must have at least 1 lowercase letter";
                    if (!/[0-9]/.test(value))
                      return "Must have at least 1 number";
                    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
                      return "Must have at least 1 special character";
                    if (/\s/.test(value))
                      return "No whitespace allowed in password";
                    return true;
                  },
                })}
                className={styles.inputField}
              />
            </div>
            {errors.password && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className={styles.button}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Sign Up"}
          </button>
        </form>

        <p className={styles.loginLink}>
          <Link to="/login">Already have an account? Log In</Link>
        </p>
      </div>
    </div>
  );
}
