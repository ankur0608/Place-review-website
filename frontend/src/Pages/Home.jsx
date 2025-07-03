import { Suspense } from "react";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import { useTheme } from "../store/ThemeContext.jsx";
import heroimg from "../assets/photo.webp";
import PlacesSlider from "../Components/PlacesSlider.jsx";

export default function Home() {
  const { theme } = useTheme();
  return (
    <>
      <div
        className={`${styles.home} ${
          theme === "dark" ? styles.dark : styles.light
        }`}
      >
        <div className={styles.hero}>
          <h1>
            Discover & <span>Review Amazing </span>Places
          </h1>
          <div>
            <p>
              Find the best spots to visit and share your experiences with
              others.
            </p>
          </div>

          <Link to="/places">
            <button className={styles.btn}>Explore</button>
          </Link>
        </div>
        <div>
          <img src={heroimg} />
        </div>
      </div>
      <Suspense fallback={<div>Loading Places...</div>}>
        <PlacesSlider />
      </Suspense>
    </>
  );
}
