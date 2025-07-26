import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CiDark } from "react-icons/ci";
import { LuSun } from "react-icons/lu";
import {
  FaBlog,
  FaHome,
  FaMapMarkedAlt,
  FaInfoCircle,
  FaEnvelope,
} from "react-icons/fa";
import { useTheme } from "../../store/ThemeContext";
import styles from "./Navbar.module.css";
import userLogo2 from "../../assets/user.png";
import Dropdown from "../../Components/Dropdown.jsx";
import supabase from "../../../lib/supabaseClient.js";

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
    { name: "Blog", path: "/blog", icon: <FaBlog /> },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedImage = localStorage.getItem("image");

    setIsLoggedIn(!!token);
    if (storedImage) setAvatar(storedImage);
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setIsLoggedIn(true);
        const userAvatar = session.user.user_metadata?.avatar_url || userLogo2;
        setAvatar(userAvatar);
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getSession();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("token");
    localStorage.removeItem("image");
    setIsLoggedIn(false);
    setAvatar(userLogo2);
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      {/* === Left Section: Logo + Hamburger === */}
      <div className={styles.leftSection}>
        <button
          className={styles.menuToggle}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle Menu"
          aria-expanded={menuOpen}
        >
          ☰
        </button>

        <div className={styles.logo}>
          <Link to="/">PlaceReview</Link>
        </div>
      </div>

      {/* === Center: Nav Links === */}
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

        {/* === Mobile Auth & Theme Toggle === */}
        <li className={styles.mobileExtras}>
          <button
            onClick={toggleTheme}
            className={styles.themeButton}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <CiDark size={24} /> : <LuSun size={24} />}
          </button>

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

      {/* === Right Section: Avatar + Theme Toggle === */}
      <div className={styles.rightSection}>
        <button
          onClick={toggleTheme}
          className={styles.themeButton}
          aria-label="Toggle Theme"
        >
          {theme === "light" ? <CiDark size={30} /> : <LuSun size={30} />}
        </button>

        {isLoggedIn ? (
          <Dropdown avatar={avatar} onLogout={handleLogout} />
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
