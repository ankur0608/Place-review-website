import styles from "./Navbar.module.css";
import { Link, NavLink } from "react-router-dom";
import { CiDark } from "react-icons/ci";
import { LuSun } from "react-icons/lu";
import { useTheme } from "../../store/ThemeContext";
import { useState } from "react";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = ["Home", "Places", "Reviews", "About", "Contact"];

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/home">PlaceReview</Link>
      </div>

      <div className={styles.topRightButtons}>
        <button
          className={styles.themeButton}
          onClick={toggleTheme}
          aria-label="Toggle Theme"
        >
          {theme === "light" ? <CiDark size={22} /> : <LuSun size={22} />}
        </button>

        <button
          className={styles.menuToggle}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle Menu"
        >
          ☰
        </button>
      </div>

      <ul className={`${styles.links} ${menuOpen ? styles.open : ""}`}>
        {navItems.map((item) => (
          <li key={item}>
            <NavLink
              to={`/${item.toLowerCase()}`}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </NavLink>
          </li>
        ))}

        {/* Shown only in mobile */}
        <li className={styles.mobileExtras}>
          <Link
            to="/signup"
            className={styles.btn}
            onClick={() => setMenuOpen(false)}
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className={styles.btn}
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
        </li>
      </ul>

      {/* Desktop only */}
      <div className={styles.authButtons}>
        <div>
          <button
            onClick={toggleTheme}
            className={styles.themeButton}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <CiDark size={24} /> : <LuSun size={24} />}
          </button>
        </div>

        <Link to="/signup" className={styles.btn}>
          Sign Up
        </Link>
        <Link to="/login" className={styles.btn}>
          Login
        </Link>
      </div>
    </nav>
  );
}
