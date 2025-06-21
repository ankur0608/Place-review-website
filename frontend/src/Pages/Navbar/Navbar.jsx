import styles from "./Navbar.module.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CiDark } from "react-icons/ci";
import { LuSun } from "react-icons/lu";
import { useTheme } from "../../store/ThemeContext";
import { useEffect, useState } from "react";
import userLogo from "../../assets/user.png";
export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Places", path: "/places" },
    // { name: "Reviews", path: "/reviews" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  }

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link to="/">PlaceReview</Link>
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
            aria-expanded={menuOpen}
          >
            ☰
          </button>
        </div>

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

          {/* Mobile-only auth buttons */}
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

        {/* Desktop-only auth buttons */}
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
        </div>

        <Link to="Profile">
          <img src={userLogo} alt="User" className={styles.userLogo} />
        </Link>
      </nav>
    </>
  );
}
