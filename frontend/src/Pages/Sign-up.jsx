import { useForm } from "react-hook-form";
import styles from "./Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../store/ThemeContext";
import { FaRegUser } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";
import { IoMailOutline } from "react-icons/io5";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function Signup() {
  const insertUser = useMutation(api.users.insertUser);
  const { theme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigator = useNavigate();

  async function onSubmit(data) {
    try {
      // 1. Hash password using Node backend
      const res = await fetch(
        "https://place-review-website-real.onrender.com/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: data.name, // <-- send as username
            email: data.email,
            password: data.password,
          }),
        }
      );

      const hashedUser = await res.json(); // { username, email, password (hashed) }

      // 2. Store hashed user in Convex
      await insertUser(hashedUser);
      navigator("/login");
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed. Please try again.");
    }
  }

  return (
    <>
      <div className={`${styles.container} ${styles[theme]}`}>
        <div className={styles.card}>
          <h2 className={styles.heading}>Sign Up</h2>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Name */}
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Name
              </label>
              <div className={styles.inputWrapper}>
                <FaRegUser className={styles.inputIcon} />
                <input
                  id="name"
                  placeholder="Enter your name"
                  {...register("name", {
                    required: "Name is required",
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Name should contain alphabets only",
                    },
                    validate: (value) =>
                      !/\d/.test(value) || "Name should not contain numbers",
                  })}
                  className={styles.inputField}
                />
              </div>
              {errors.name && (
                <p className={styles.error}>{errors.name.message}</p>
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
    </>
  );
}
