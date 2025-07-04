import { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { jwtDecode } from "jwt-decode";
import userLogo from "../assets/user.png";

export default function Profile() {
  const [imageUrl, setImageUrl] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Decode token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.id); // ✅ Get actual user ID
    } catch (error) {
      console.error("Invalid token:", error);
      navigate("/login");
    }

    const storedImage = localStorage.getItem("image");
    setImageUrl(storedImage);
  }, [navigate]);

  const userData = useQuery(
    api.users.getUserById,
    userId ? { userId } : "skip" // 🛡️ Skip query if no userId
  );

  function handleEdit() {
    navigate("/Editprofile");
  }

  function handleBack() {
    navigate("/");
  }

  if (!userData) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className={styles.Profile}>
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
              <strong>Username:</strong> {userData.username}
            </p>
            <p>
              <strong>Email:</strong> {userData.email}
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
