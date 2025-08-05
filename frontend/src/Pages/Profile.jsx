import React, { useEffect, useState } from "react";
import supabase from "../../lib/supabaseClient";
import Avatar from "@mui/material/Avatar";
import styles from "./Profile.module.css";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    avatar: "",
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    const { data: sessionData } = await supabase.auth.getSession();

    if (sessionData?.session) {
      const user = sessionData.session.user;
      const isGoogle = user.app_metadata?.provider === "google";
      setIsGoogleUser(isGoogle);

      const name =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        "Google User";

      const avatar =
        user.user_metadata?.avatar_url || user.user_metadata?.picture || "";

      setUserData({ id: user.id, name, email: user.email, avatar });
      setForm({ name, email: user.email, avatar });
    } else {
      const name = localStorage.getItem("username") || "Simple User";
      const email = localStorage.getItem("email") || "no-email@example.com";
      const avatar = localStorage.getItem("user_avatar") || "";

      setIsGoogleUser(false);
      setUserData({ id: "local", name, email, avatar });
      setForm({ name, email, avatar });
    }
  }

  const handleSave = async () => {
    if (isGoogleUser) {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: form.name,
          avatar_url: form.avatar,
        },
      });

      if (error) {
        console.error("Supabase update error:", error.message);
        return;
      }
    } else {
      localStorage.setItem("username", form.name);
      localStorage.setItem("email", form.email);
      localStorage.setItem("user_avatar", form.avatar);
    }

    setUserData({ ...userData, ...form });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  function handleBack() {
    return () => {
      navigate(-1);
    };
  }

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.profileCard}>
        <div className={styles.avatarContainer}>
          <Avatar
            src={userData.avatar}
            sx={{ width: 96, height: 96, fontSize: 32 }}
          >
            {!userData.avatar && getInitials(userData.name)}
          </Avatar>
        </div>

        {isEditing ? (
          <div className={styles.form}>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className={styles.input}
            />
            <input
              disabled
              type="email"
              name="email"
              value={form.email}
              className={styles.input}
            />
            <input
              type="text"
              name="avatar"
              value={form.avatar}
              onChange={handleChange}
              placeholder="Avatar URL"
              className={styles.input}
            />
            <button onClick={handleSave} className={styles.saveBtn}>
              Save
            </button>
          </div>
        ) : (
          <div className={styles.info}>
            <p>
              <strong>Name :</strong>
              {userData.name}
            </p>
            <p>
              <strong>Email :</strong>
              {userData.email}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className={styles.editBtn}
            >
              Edit
            </button>
            <button onClick={handleBack()} className={styles.editBtn}>
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
