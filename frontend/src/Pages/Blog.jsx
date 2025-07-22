// src/Pages/BlogList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./BlogList.module.css";
import { Link, redirect } from "react-router-dom";
import { useTheme } from "../store/ThemeContext";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const { theme } = useTheme();
  useEffect(() => {
    axios;
    axios
      .get("https://cms-waau.onrender.com/api/places?populate=*")
      .then((res) => setBlogs(res.data.data))
      .catch((err) => console.error("Error fetching blogs:", err));
  }, []);

  const token = localStorage.getItem("token");
  if (!token) {
    redirect("/login");
  }

  return (
    <div
      className={`${styles.container}${theme === "dark" ? ` ${styles.dark}` : ""}`}
    >
      <h1 className={styles.heading}>Latest Blog Posts</h1>
      <div className={styles.grid}>
        {blogs.map(({ id, title, Content, slug, Image }) => {
          const imageUrl = `https://cms-waau.onrender.com${Image?.formats?.small?.url || Image?.url}`;

          return (
            <div key={id} className={styles.card}>
              <img
                src={imageUrl}
                alt={Image?.name || title}
                className={styles.image}
              />
              <div className={styles.content}>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.excerpt}>{Content?.slice(0, 100)}...</p>
                <Link to={`/blog/${slug}`} className={styles.readMore}>
                  Read More →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
