import { useState, useRef, useEffect } from "react";
import styles from "./ChatBox.module.css";
import { useTheme } from "../store/ThemeContext";

const initialPredefinedQuestions = [
  { icon: "⭐", text: "What are the top-rated places nearby?" },
  { icon: "✍️", text: "How do I submit a review?" },
  { icon: "📝", text: "Can I edit my review after posting?" },
  { icon: "📞", text: "Is there a way to contact support?" },
  { icon: "📊", text: "How are place ratings calculated?" },
];

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [predefinedQuestions, setPredefinedQuestions] = useState(
    initialPredefinedQuestions
  );
  const { theme } = useTheme();
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const sendMessage = async (customInput) => {
    const messageToSend = customInput !== undefined ? customInput : input;
    // if (!messageToSend.trim()) return;

    const newUserMsg = { sender: "user", text: messageToSend };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch(
        "https://place-review-website-real.onrender.com/api/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: messageToSend }),
        }
      );

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
  const handlePredefinedClick = (questionText) => {
    sendMessage(questionText);
    setPredefinedQuestions([]); // Remove all predefined questions
  };

  return (
    <div className={`${styles.chatContainer} ${themeClass}`}>
      {/* Message List */}
      <div className={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.sender === "user" ? styles.userMsg : styles.botMsg}
          >
            {msg.sender === "bot" ? (
              <div className={styles.botMsgContent}>
                <div className={styles.botHeader}>
                  🤖 <span>PlaceBot</span>
                </div>
                <div className={styles.botText}>{msg.text}</div>
              </div>
            ) : (
              msg.text
            )}
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
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Questions just above input */}
      <div className={styles.predefinedBox}>
        {predefinedQuestions.map((q, i) => (
          <button
            key={i}
            className={styles.predefinedBtn}
            onClick={() => handlePredefinedClick(q.text)}
          >
            {q.icon} {q.text}
          </button>
        ))}
      </div>

      {/* Input Box (sticky at bottom) */}
      <div className={styles.inputBox}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button onClick={() => sendMessage()}>Send</button>
      </div>
    </div>
  );
}
