import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../../lib/supabaseClient";
import styles from "./BlogList.module.css";
import { useTheme } from "../store/ThemeContext";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("id, title, slug, cover_image, created_at")
        .order("created_at", { ascending: false });

      if (!error) setBlogs(data);
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div
      className={`${styles.blogList} ${
        theme === "dark" ? styles.dark : styles.light
      }`}
    >
      <h2 className={styles.heading}>Latest Blog Posts</h2>

      <div className={styles.grid}>
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={styles.skeletonCard}></div>
            ))
          : blogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blog/${blog.slug}`}
                className={styles.card}
              >
                {blog.cover_image && (
                  <img
                    src={blog.cover_image}
                    alt="cover"
                    className={styles.image}
                    loading="lazy"
                  />
                )}
                <div className={styles.cardContent}>
                  <h3 className={styles.title}>{blog.title}</h3>
                  <p className={styles.date}>{formatDate(blog.created_at)}</p>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default BlogList;
