import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../Pages/Navbar/Navbar.module.css";
import userLight from "../../src/assets/user.png";
import userDark from "../assets/user1.png";
import { useTheme } from "../store/ThemeContext";

export default function AvatarDropdown() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  const handleEscape = (event) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Determine avatar based on theme or localStorage image
  const storedAvatar = localStorage.getItem("image");
  const avatar = storedAvatar || (theme === "dark" ? userDark : userLight);

  return (
    <div className={styles.dropdownWrapper} ref={dropdownRef}>
      <img
        src={avatar}
        alt="User Avatar"
        className={styles.avatar}
        onClick={() => setOpen((prev) => !prev)}
        tabIndex={0}
      />
      {open && (
        <div className={styles.dropdownMenu}>
          <Link to="/Profile" className={styles.dropdownItem}>
            👤 Profile
          </Link>
          <Link to="/SavedPlace" className={styles.dropdownItem}>
            📌 Saved Place
          </Link>
          <button onClick={handleLogout} className={styles.dropdownItem}>
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
}
