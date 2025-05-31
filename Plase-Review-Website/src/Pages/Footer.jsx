import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        &copy; {new Date().getFullYear()} Rental Outfit. All rights reserved.
      </p>
      <div className={styles.links}>
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
        <a href="/contact">Contact Us</a>
      </div>
    </footer>
  );
}
