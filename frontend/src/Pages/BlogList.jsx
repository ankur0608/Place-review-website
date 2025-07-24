import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../../lib/supabaseClient";
import styles from "./BlogList.module.css";
import { useTheme } from "../store/ThemeContext";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  const { theme } = useTheme();

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("id, title, slug, cover_image, created_at")
        .order("created_at", { ascending: false });

      if (!error) setBlogs(data);
    };

    fetchBlogs();
  }, []);

  return (
    <div
      className={`${styles.blogList} ${
        theme === "dark" ? styles.dark : styles.light
      }`}
    >
      <h2 className={styles.heading}>Latest Blog Posts</h2>
      <div className={styles.grid}>
        {blogs.map((blog) => (
          <Link key={blog.id} to={`/blog/${blog.slug}`} className={styles.card}>
            {blog.cover_image && (
              <img
                src={blog.cover_image}
                alt="cover"
                className={styles.image}
              />
            )}
            <div className={styles.cardContent}>
              <h3 className={styles.title}>{blog.title}</h3>
              <p className={styles.date}>
                {new Date(blog.created_at).toDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
