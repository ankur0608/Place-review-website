import { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import userLogo from "../assets/user.png";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState({ username: "", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");

    if (!storedUsername || !storedEmail) {
      navigate("/login");
    } else {
      setUser({ username: storedUsername, email: storedEmail });
    }
  }, [navigate]);

  function handleEdit() {
    navigate("/edit-profile");
  }

  return (
    <div className={styles.Profile}>
      <div className={styles.profileContainer}>
        <h2>User Profile</h2>
        <div className={styles.profileCard}>
          <img src={userLogo} alt="User Avatar" className={styles.avatar} />
          <div className={styles.info}>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <button onClick={handleEdit} className={styles.editButton}>
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
