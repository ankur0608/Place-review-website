import { useState } from "react";
import styles from "./ChatBox.module.css";
import { useTheme } from "../store/ThemeContext";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { theme } = useTheme();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newUserMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMsg = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: Failed to get reply." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const themeClass = theme === "dark" ? styles.dark : styles.light;

  return (
    <div className={`${styles.chatContainer} ${themeClass}`}>
      <div className={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.sender === "user" ? styles.userMsg : styles.botMsg}
          >
            {msg.text}
          </div>
        ))}
        {isTyping && (
          <div className={styles.botMsg}>
            <span className={styles.typingDots}>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </div>
        )}
      </div>
      <div className={styles.inputBox}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
