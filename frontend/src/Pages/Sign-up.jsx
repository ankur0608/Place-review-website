import { useForm } from "react-hook-form";
import styles from "./Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../store/ThemeContext";
import { useRef, useState } from "react";
import Modal from "../Components/Modal";
import { FaRegUser } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";
import { IoMailOutline } from "react-icons/io5";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Loading from "../Components/Loading.jsx";
export default function Signup() {
  const insertUser = useMutation(api.users.insertUser);
  const { theme } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ Added
  const modalRef = useRef();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigator = useNavigate();

  async function onSubmit(data) {
    setLoading(true);
    try {
      // 1. Hash password using Node backend
      const res = await fetch(
        "https://place-review-website-real.onrender.com/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const hashedUser = await res.json(); // { username, email, password (hashed) }

      // 2. Store hashed user in Convex
      await insertUser(hashedUser);

      // 3. Show success modal
      setShowModal(true);
      modalRef.current.open();
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleCloseModal = () => {
    setShowModal(false);
    navigator("/login");
  };

  return (
    <>
      <Modal
        ref={modalRef}
        buttonCaption="Go to Login"
        onModalclose={handleCloseModal}
      >
        <h1>Signup successful!</h1>
      </Modal>

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
