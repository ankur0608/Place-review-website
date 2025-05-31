import { useRef, useImperativeHandle, forwardRef } from "react";
import { createPortal } from "react-dom";
import img from "../assets/Ture.png";
import styles from "./Modal.module.css";

const Modal = forwardRef(
  ({ children, buttonCaption, onModalclose, isSuccess = true }, ref) => {
    const dialog = useRef();

    useImperativeHandle(ref, () => ({
      open() {
        dialog.current.showModal();
      },
    }));

    return createPortal(
      <dialog className={styles.popup} ref={dialog}>
        <img src={img} className={styles.img} alt="Success illustration" />
        <div>{children}</div>
        <form method="dialog">
          <button onClick={onModalclose} className={styles["btn-ok"]}>
            {buttonCaption}
          </button>
        </form>
      </dialog>,
      document.getElementById("modal")
    );
  }
);

export default Modal;
