import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import supabase from "../../lib/supabaseClient";
import { useTheme } from "../store/ThemeContext";
import styles from "./BlogPost.module.css";

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!error) setPost(data);
    };

    fetchPost();
  }, [slug]);

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (!post) {
    return (
      <div
        className={`${styles.blogPost} ${
          theme === "dark" ? styles.dark : styles.light
        }`}
      >
        <div className={styles.skeleton}>
          <Skeleton height={300} style={{ marginBottom: "1rem" }} />
          <Skeleton height={40} width="70%" />
          <Skeleton height={20} width="30%" />
          <Skeleton count={6} height={16} style={{ marginTop: "1rem" }} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.blogPost} ${
        theme === "dark" ? styles.dark : styles.light
      }`}
    >
      <button onClick={handleBack} className={styles.backButton}>
        ← Back
      </button>

      <h1 className={styles.title}>{post.title}</h1>

      {post.cover_image && (
        <img
          src={post.cover_image}
          alt={`${post.title} cover`}
          className={styles.cover}
        />
      )}

      <p className={styles.meta}>
        {post.author ? `By ${post.author}` : "Unknown"} •{" "}
        {new Date(post.created_at).toDateString()}
      </p>

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
};

export default BlogPost;
