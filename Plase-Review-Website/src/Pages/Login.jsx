import { useForm } from "react-hook-form";
import styles from "./Login.module.css";
import { useTheme } from "../store/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
const Login = () => {
  const { theme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigator = useNavigate();
  function onSubmit(data) {
    console.log("Login data:", data);
    navigator("/");
  }

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
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

          {/* Forgot password link */}
          <div className={styles.forgotPasswordContainer}>
            <Link to="/forgot-password" className={styles.forgotPasswordLink}>
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
