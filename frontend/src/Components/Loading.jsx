// src/components/LoadingSpinner.jsx
import styles from "./Loading.module.css";

export default function LoadingSpinner() {
  return (
    <div className={styles.spinnerWrapper}>
      <div className={styles.loader}></div>
    </div>
  );
}
