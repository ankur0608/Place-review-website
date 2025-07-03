import { useState } from "react";
import ChatBox from "./ChatBox";
import styles from "./ChatWidget.module.css";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className={styles.chatBoxWrapper}>
          <ChatBox />
        </div>
      )}
      <button
        className={styles.fab}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? "✖️" : "💬"}
      </button>
    </>
  );
}