import React, { useEffect, useState, lazy, Suspense, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../lib/supabaseClient";
import styles from "./Profile.module.css";
import toast, { Toaster } from "react-hot-toast";
import { Skeleton } from "@mui/material";

const Avatar = lazy(() => import("@mui/material/Avatar"));

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
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
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
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (isGoogleUser) {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: form.name,
          avatar_url: form.avatar,
        },
      });

      if (error) {
        toast.error("Failed to update profile.");
        return;
      }

      toast.success("Profile updated successfully!");
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

  const handleBack = () => {
    navigate(-1);
  };

  const getInitials = useMemo(() => {
    return userData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }, [userData.name]);

  return (
    <div className={styles.profileWrapper}>
      <Suspense fallback={<div>Loading SEO...</div>}>
        <title>User Profile</title>
        <meta
          name="description"
          content="Manage your user profile at Place Review"
        />
      </Suspense>

      <Toaster position="top-center" />

      <div className={styles.profileCard} aria-label="User Profile Card">
        <div className={styles.avatarContainer}>
          <Suspense
            fallback={<Skeleton variant="circular" width={96} height={96} />}
          >
            <Avatar
              src={userData.avatar}
              alt={userData.name}
              sx={{ width: 96, height: 96, fontSize: 32 }}
            >
              {!userData.avatar && getInitials}
            </Avatar>
          </Suspense>
        </div>

        {isEditing ? (
          <div className={styles.form} aria-label="Edit Profile Form">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              aria-label="Name input"
              className={styles.input}
            />
            <input
              disabled
              type="email"
              name="email"
              value={form.email}
              aria-label="Email (disabled)"
              className={styles.input}
            />
            <input
              type="text"
              name="avatar"
              value={form.avatar}
              onChange={handleChange}
              placeholder="Avatar URL"
              aria-label="Avatar URL input"
              className={styles.input}
            />
            <button
              onClick={handleSave}
              className={styles.saveBtn}
              aria-label="Save Button"
            >
              Save
            </button>
          </div>
        ) : (
          <div className={styles.info} aria-label="User Info Section">
            {isLoading ? (
              <>
                <Skeleton width={150} height={30} />
                <Skeleton width={250} height={30} />
              </>
            ) : (
              <>
                <p>
                  <strong>Name: </strong>
                  {userData.name}
                </p>
                <p>
                  <strong>Email: </strong>
                  {userData.email}
                </p>
              </>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className={styles.editBtn}
              aria-label="Edit Button"
            >
              Edit
            </button>
            <button
              onClick={handleBack}
              className={styles.editBtn}
              aria-label="Back Button"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Profile);
