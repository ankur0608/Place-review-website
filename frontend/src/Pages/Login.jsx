import { useForm } from "react-hook-form";
import styles from "./Login.module.css";
import { useTheme } from "../store/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import Modal from "../Components/Modal";
import { TbLockPassword } from "react-icons/tb";
import { IoMailOutline } from "react-icons/io5";
import { useConvex } from "convex/react";

import { api } from "../../convex/_generated/api";

export default function Login() {
  const { theme } = useTheme();
  const [showSuccess, setShowSuccess] = useState(false);
  const modalRef = useRef();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigator = useNavigate();

  const convex = useConvex();

  const onSubmit = async (data) => {
    try {
      // Step 1: Get user from Convex by email
      const user = await convex.query(api.users.getUserByEmail, {
        email: data.email,
      });

      if (!user) {
        alert("User not found");
        return;
      }

      // Step 2: Send to backend for password check
      const res = await fetch(
        "https://place-review-website-real.onrender.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: data.password, user }),
        }
      );

      const result = await res.json();

      // Step 3: Check login result
      if (result.success) {
        console.log("✅ Login successful");

        localStorage.setItem("token", result.token);
        localStorage.setItem("username", user.username);
        localStorage.setItem("email", user.email);
        localStorage.setItem("id", user._id);

        setShowSuccess(true);
        modalRef.current.open();
      } else {
        alert("Invalid password");
      }
    } catch (err) {
      console.error("🔴 Login error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  function handleCloseModal() {
    setShowSuccess(false);
    navigator("/");
  }

  return (
    <>
      <Modal
        ref={modalRef}
        buttonCaption="Okay"
        onModalclose={handleCloseModal}
      >
        <h2>Login successful!</h2>
      </Modal>

      <div className={`${styles.container} ${styles[theme]}`}>
        <div className={styles.card}>
          <h2 className={styles.heading}>Login</h2>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
          </form>
        </div>
      </div>
    </>
  );
}
