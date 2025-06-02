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
      </main>
    </div>
  );
}
