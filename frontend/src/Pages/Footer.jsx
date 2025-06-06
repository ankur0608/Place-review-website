import styles from "./Footer.module.css";
import { useTheme } from "../store/ThemeContext.jsx";
import { Link } from "react-router-dom";
export default function Footer() {
  const { theme } = useTheme();
  return (
    <footer className={`${styles.footer} ${styles[theme]}`}>
      <p>
        &copy; {new Date().getFullYear()} Places Review. All rights reserved.
      </p>
      <div className={styles.links}>
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
        <Link to="/contact">Contact Us</Link>
      </div>
    </footer>
  );
}
