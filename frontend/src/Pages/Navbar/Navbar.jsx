import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CiDark } from "react-icons/ci";
import { LuSun } from "react-icons/lu";
import { useTheme } from "../../store/ThemeContext";
import styles from "./Navbar.module.css";
import userLogo2 from "../../assets/user.png";
import Dropdown from "../../Components/Dropdown.jsx";
import { FaBlog } from "react-icons/fa";
import {
  FaHome,
  FaMapMarkedAlt,
  FaInfoCircle,
  FaEnvelope,
} from "react-icons/fa";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatar, setAvatar] = useState(userLogo2);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Places", path: "/places", icon: <FaMapMarkedAlt /> },
    { name: "About", path: "/about", icon: <FaInfoCircle /> },
    { name: "Contact", path: "/contact", icon: <FaEnvelope /> },
    // { name: "Blog", path: "/blog", icon: <FaBlog /> },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    const storedImage = localStorage.getItem("image");
    if (storedImage) setAvatar(storedImage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("image");
    setIsLoggedIn(false);
    setAvatar(userLogo2);
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      {/* Hamburger Menu (Mobile) */}
      <button
        className={styles.menuToggle}
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle Menu"
        aria-expanded={menuOpen}
      >
        ☰
      </button>

      {/* Profile Avatar (mobile top-right) */}
      {isLoggedIn && (
        <div className={styles.menuToggle}>
          <Dropdown />
        </div>
      )}

      {/* Theme Toggle (mobile top-right) */}
      <div className={styles.menuToggle}>
        <button
          onClick={toggleTheme}
          className={styles.themeButton}
          aria-label="Toggle Theme"
        >
          {theme === "light" ? <CiDark size={26} /> : <LuSun size={26} />}
        </button>
      </div>

      {/* Logo */}
      <div className={styles.logo}>
        <Link to="/">PlaceReview</Link>
      </div>

      {/* Nav Links */}
      <ul className={`${styles.links} ${menuOpen ? styles.open : ""}`}>
        <li className={styles.menuToggle}>
          <button
            className={styles.closeBtn}
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
        </li>
        {navItems.map(({ name, path, icon }) => (
          <li key={name} className={styles.linkWrapper}>
            <NavLink
              to={path}
              end={path === "/"}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
              onClick={() => setMenuOpen(false)}
            >
              <span className={styles.mobileIcon}>{icon}</span>
              <span className={styles.linkText}>{name}</span>
            </NavLink>
          </li>
        ))}

        {/* Mobile Auth Buttons */}
        <li className={styles.mobileExtras}>
          {isLoggedIn ? (
            <button
              className={styles.btn}
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
            >
              Logout
            </button>
          ) : (
            <>
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
            </>
          )}
        </li>
      </ul>

      {/* Desktop Auth and Theme */}
      <div className={styles.authButtons}>
        <button
          onClick={toggleTheme}
          className={styles.themeButton}
          aria-label="Toggle Theme"
        >
          {theme === "light" ? <CiDark size={26} /> : <LuSun size={26} />}
        </button>

        {isLoggedIn ? (
          <>
            <button
              className={`${styles.btn} ${styles.logoutBtn}`}
              onClick={handleLogout}
            >
              Logout
            </button>
            <Dropdown />
          </>
        ) : (
          <>
            <Link to="/signup" className={styles.btn}>
              Sign Up
            </Link>
            <Link to="/login" className={styles.btn}>
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
