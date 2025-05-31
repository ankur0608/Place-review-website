import { useForm } from "react-hook-form";
import styles from "./Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../store/ThemeContext";
import { useRef, useState } from "react";
import Modal from "../Components/Modal";

export default function Signup() {
  const { theme } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigator = useNavigate();

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    setShowModal(true);
    modalRef.current.open(); 
  };

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
              <input
                id="username"
                placeholder="Enter your username"
                {...register("username", { required: "Username is required" })}
                className={styles.inputField}
              />
              {errors.username && (
                <p className={styles.error}>{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
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
              {errors.email && (
                <p className={styles.error}>{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
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
              {errors.password && (
                <p className={styles.error}>{errors.password.message}</p>
              )}
            </div>

            <button type="submit" className={styles.button}>
              Sign Up
            </button>
          </form>

          <p className={styles.loginLink}>
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </div>
      </div>
    </>
  );
}
