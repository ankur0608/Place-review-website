import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import styles from "../Pages/Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../store/ThemeContext";
import { FaRegUser } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";
import { IoMailOutline } from "react-icons/io5";
import supabase from "../../lib/supabaseClient";

export default function EditProfile() {
  const { theme } = useTheme();
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm();

  // Fetch user from Supabase
  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
      } else {
        reset({
          username: data.username || "",
          email: data.email || "",
          password: data.password || "",
        });
      }
      setLoading(false);
    }

    if (userId) {
      fetchUser();
    }
  }, [userId, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        localStorage.setItem("image", base64);
        setPreviewImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data) {
    try {
      const { error } = await supabase
        .from("users")
        .update({
          username: data.username,
          email: data.email,
          password: data.password,
        })
        .eq("id", userId);

      if (error) throw error;

      localStorage.setItem("username", data.username);
      localStorage.setItem("email", data.email);

      alert("✅ Profile updated!");
      navigate("/profile");
    } catch (error) {
      console.error("Update failed", error);
      alert("❌ Failed to update profile.");
    }
  }

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading profile...</p>;
  }

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Edit Profile</h2>
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
                {...register("username", { required: "Username is required" })}
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
                placeholder="Enter new password"
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

          {/* Profile Image */}
          <div className={styles.formGroup}>
            <label htmlFor="profileImage" className={styles.label}>
              Profile Image
            </label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              {...register("profileImage")}
              onChange={handleImageChange}
              className={styles.inputField}
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                style={{
                  marginTop: "10px",
                  maxHeight: "100px",
                  borderRadius: "10px",
                }}
              />
            )}
          </div>

          <button type="submit" className={styles.button}>
            Save Changes
          </button>
        </form>

        <p className={styles.loginLink}>
          <Link to="/profile">Back to Profile</Link>
        </p>
      </div>
    </div>
  );
}
