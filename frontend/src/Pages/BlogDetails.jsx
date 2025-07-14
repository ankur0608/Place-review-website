import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./BlogDetails.module.css";
import { useTheme } from "../store/ThemeContext.jsx";
import LoadingSpinner from "../Components/Loading.jsx";

export default function BlogDetails() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `http://localhost:1337/api/places?filters[slug][$eq]=${slug}&populate=*`
      )
      .then((res) => {
        const found = res.data.data[0];
        setBlog(found);
      })
      .catch((err) => {
        console.error("Failed to fetch blog:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <LoadingSpinner />;
  if (!blog) return <div className={styles.notFound}>Blog not found</div>;

  const { title, Content, Image, publishedAt } = blog;
  const imageUrl = `http://localhost:1337${
    Image?.formats?.small?.url || Image?.url
  }`;

  return (
    <div
      className={`${styles.blogDetail} ${theme === "dark" ? styles.dark : ""}`}
    >
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        Go Back
      </button>

      <h1 className={styles.title}>{title}</h1>
      <img src={imageUrl} alt={Image?.name || title} className={styles.image} />
      <p className={styles.date}>
        Published on {new Date(publishedAt).toLocaleDateString()}
      </p>
      <div className={styles.content}>{Content}</div>
    </div>
  );
}
