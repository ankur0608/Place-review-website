import styles from "./About.module.css";
import { useTheme } from "../store/ThemeContext";
export default function About() {
  const { theme } = useTheme();
  return (
    <div className={`${styles.aboutPage} ${styles[theme]}`}>
      <main className={styles.content}>
        <h2>About Us</h2>
        <p>
          Welcome to Place Review! We are dedicated to helping travelers
          discover amazing places and share their experiences. Our platform
          allows users to browse through reviews, connect with fellow travelers,
          and contribute their own insights to the community.
        </p>
        <p>Join us in exploring the world, one review at a time!</p>
        <h3>Project Features</h3>
        <ul>
          <li>
            <strong>Discover Places:</strong> Browse a curated list of famous
            monuments, natural wonders, and hidden gems across India.
          </li>
          <li>
            <strong>User Reviews:</strong> Read and write reviews for each place,
            including star ratings and comments.
          </li>
          <li>
            <strong>Save Favorites:</strong> Save your favorite places to your
            personal list for quick access later.
          </li>
          <li>
            <strong>Profile Management:</strong> Edit your profile, update your
            information, and upload a profile picture.
          </li>
          <li>
            <strong>Authentication:</strong> Secure signup and login with password
            hashing and JWT-based authentication.
          </li>
          <li>
            <strong>Contact & Feedback:</strong> Reach out to us with your
            questions or suggestions using the contact form.
          </li>
          <li>
            <strong>Responsive Design:</strong> Enjoy a seamless experience on
            desktop, tablet, and mobile devices.
          </li>
        </ul>
        <h3>Technologies Used</h3>
        <ul>
          <li>React.js (Frontend with Vite)</li>
          <li>Node.js & Express (Backend API)</li>
          <li>Convex (Database & Realtime)</li>
          <li>JWT for authentication</li>
          <li>React Router for navigation</li>
          <li>Custom CSS modules for styling</li>
        </ul>
        <h3>Our Mission</h3>
        <p>
          We aim to build a vibrant community of explorers who share honest
          reviews and help others make informed travel decisions. Whether you are
          planning your next trip or want to share your experience, Place Review
          is your trusted companion.
        </p>
      </main>
    </div>
  );
}
