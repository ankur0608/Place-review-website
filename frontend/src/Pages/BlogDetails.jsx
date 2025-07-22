// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import styles from "./BlogDetails.module.css";
// import { useTheme } from "../store/ThemeContext.jsx";
// import LoadingSpinner from "../Components/Loading.jsx";
// import { AiFillHeart } from "react-icons/ai";
// // import { useMutation, useQuery } from "convex/react";
// // import { api } from "../../convex/_generated/api.js";

// export default function BlogDetails() {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const { theme } = useTheme();

//   const [blog, setBlog] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [liked, setLiked] = useState(false);

//   const likes = useQuery(api.blogLikes.getLikes, slug ? { slug } : "skip");
//   const likeBlog = useMutation(api.blogLikes.likeBlog);

//   useEffect(() => {
//     axios
//       .get(
//         `https://cms-waau.onrender.com/api/places?filters[slug][$eq]=${slug}&populate=*`
//       )
//       .then((res) => {
//         setBlog(res.data.data[0]);
//       })
//       .catch((err) => console.error("Failed to fetch blog:", err))
//       .finally(() => setLoading(false));
//   }, [slug]);

//   const handleLike = async () => {
//     if (!slug || liked) return;
//     await likeBlog({ slug });
//     setLiked(true);
//   };

//   if (loading) return <LoadingSpinner />;
//   if (!blog) return <div className={styles.notFound}>Blog not found</div>;

//   const { title, Content, Image, publishedAt } = blog;
//   const imageUrl = `https://cms-waau.onrender.com${Image?.formats?.small?.url || Image?.url}`;

//   return (
//     <div
//       className={`${styles.blogDetail} ${theme === "dark" ? styles.dark : ""}`}
//     >
//       <button onClick={() => navigate(-1)} className={styles.backButton}>
//         ← Go Back
//       </button>

//       <h1 className={styles.title}>{title}</h1>
//       <img src={imageUrl} alt={Image?.name || title} className={styles.image} />

//       <p className={styles.date}>
//         Published on {new Date(publishedAt).toLocaleDateString()}
//       </p>

//       <button
//         className={`${styles.likeButton} ${liked ? styles.liked : ""}`}
//         onClick={handleLike}
//       >
//         <AiFillHeart className={styles.heartIcon} />
//         <span>{likes ?? 0}</span>
//       </button>

//       <div className={styles.content}>{Content}</div>
//     </div>
//   );
// }
