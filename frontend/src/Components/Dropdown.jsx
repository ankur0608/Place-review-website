import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import userLogo from "../../src/assets/user.png";
import styles from "../Pages/Navbar/Navbar.module.css";

export default function AvatarDropdown() {
  const navigate = useNavigate();
  const avatar = localStorage.getItem("image") || userLogo;
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdownWrapper} ref={dropdownRef}>
      <img
        src={avatar}
        alt="User Avatar"
        className={styles.avatar}
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className={styles.dropdownMenu}>
          <Link to="/profile" className={styles.dropdownItem}>
            👤 Profile
          </Link>
          <button onClick={handleLogout} className={styles.dropdownItem}>
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
}
