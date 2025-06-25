import { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import userLogo from "../assets/user.png";
export default function Profile() {
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");

  const userData = useQuery(api.users.getUserById, { userId });

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    } else {
      const storedImage = localStorage.getItem("image");
      setImageUrl(storedImage);
    }
  }, [navigate, userId]);

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
            src={localStorage.getItem("image") || userLogo}
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
