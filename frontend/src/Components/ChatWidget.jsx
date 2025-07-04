import { useState, lazy, Suspense } from "react";
import styles from "./ChatWidget.module.css";

const ChatBox = lazy(() => import("./ChatBox"));

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className={styles.chatBoxWrapper}>
          <Suspense fallback={<div>Loading chat...</div>}>
            <ChatBox />
          </Suspense>
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
