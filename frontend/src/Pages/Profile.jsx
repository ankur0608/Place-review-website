import { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useTheme } from "../store/ThemeContext";
import userLogo from "../assets/user.png";

export default function Profile() {
  const [imageUrl, setImageUrl] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      // You can use decoded.id if needed for future requests
    } catch (error) {
      console.error("Invalid token:", error);
      navigate("/login");
    }

    // 🟢 Get user data from localStorage
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    const storedImage = localStorage.getItem("image");

    if (storedUsername) setUsername(storedUsername);
    if (storedEmail) setEmail(storedEmail);
    if (storedImage) setImageUrl(storedImage);
  }, [navigate]);

  function handleEdit() {
    navigate("/Editprofile");
  }

  function handleBack() {
    navigate("/");
  }

  return (
    <div className={`${styles.Profile} ${theme === "dark" ? "dark" : ""}`}>
      <div className={styles.profileContainer}>
        <h2>User Profile</h2>
        <div className={styles.profileCard}>
          <img
            src={imageUrl || userLogo}
            alt="User Avatar"
            className={styles.avatar}
          />
          <div className={styles.info}>
            <p>
              <strong>Username:</strong> {username}
            </p>
            <p>
              <strong>Email:</strong> {email}
            </p>
            <button className={styles.backButton} onClick={handleBack}>
              Back to home
            </button>
            <button onClick={handleEdit} className={styles.editButton}>
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
