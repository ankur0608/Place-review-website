import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CiDark } from "react-icons/ci";
import { LuSun } from "react-icons/lu";
import { useTheme } from "../../store/ThemeContext";
import styles from "./Navbar.module.css";
// import userLogo from "../../assets/user.png";
import Dropdown from "../../Components/Dropdown.jsx";
export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Places", path: "/places" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const avatar = localStorage.getItem("image") || userLogo;

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

      {/* Logo */}
      <div className={styles.logo}>
        <Link to="/">PlaceReview</Link>
      </div>

      {/* Nav Links */}
      <ul className={`${styles.links} ${menuOpen ? styles.open : ""}`}>
        {navItems.map(({ name, path }) => (
          <li key={name}>
            <NavLink
              to={path}
              end={path === "/"}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {name}
            </NavLink>
          </li>
        ))}
        {/* Profile Avatar */}
        <li className={styles.menuToggle}>
          <Link to="/profile">
            <img src={avatar} alt="User Avatar" className={styles.avatar} />
          </Link>
        </li>
        {/* Auth Buttons (Mobile Only) */}
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

      {/* Desktop Auth + Theme Buttons */}
      <div className={styles.authButtons}>
        <button
          onClick={toggleTheme}
          className={styles.themeButton}
          aria-label="Toggle Theme"
        >
          {theme === "light" ? <CiDark size={26} /> : <LuSun size={26} />}
        </button>

        {isLoggedIn ? (
          <button
            className={`${styles.btn} ${styles.logoutBtn}`}
            onClick={handleLogout}
          >
            Logout
          </button>
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
        {/* <button to="/Dropdown">
          <img src={avatar} alt="User Avatar" className={styles.avatar} />
        </button> */}
        <Dropdown />
      </div>
    </nav>
  );
}
