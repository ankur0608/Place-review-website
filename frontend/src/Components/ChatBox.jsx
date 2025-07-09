import { useState, useRef, useEffect } from "react";
import styles from "./ChatBox.module.css";
import { useTheme } from "../store/ThemeContext";
import { useConvex } from "convex/react";
import { api } from "../../../convex/_generated/api";

const initialPredefinedQuestions = [
  { icon: "📍", text: "What are the best-rated places near me?" },
  { icon: "⏰", text: "Can I book a visit for a specific date and time?" },
  { icon: "🗺️", text: "How do I find places by location or state?" },
  // { icon: "🔐", text: "I can't log in — what should I do?" },
  // { icon: "💬", text: "How do I leave a review for a place?" },
  // { icon: "📝", text: "Can I edit or delete my review later?" },
  // { icon: "📊", text: "How are place ratings calculated?" },
  // { icon: "📞", text: "How do I contact support?" },
  // { icon: "🔄", text: "Can I update my booking details later?" },
];

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [predefinedQuestions, setPredefinedQuestions] = useState(
    initialPredefinedQuestions
  );
  const [modelUsed, setModelUsed] = useState("");

  const { theme } = useTheme();
  const themeClass = theme === "dark" ? styles.dark : styles.light;

  const chatEndRef = useRef(null);
  const convex = useConvex();

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (customInput) => {
    const messageToSend = customInput ?? input;
    if (!messageToSend.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: messageToSend }]);
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
      const botReply = data.reply || "No response";

      setModelUsed(data.model || "Unknown Model");
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);

      await convex.mutation(api.messages.add, {
        sender: "user",
        text: messageToSend,
      });
      await convex.mutation(api.messages.add, {
        sender: "bot",
        text: botReply,
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: Failed to get reply." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handlePredefinedClick = (text) => {
    sendMessage(text);
    setPredefinedQuestions([]);
  };

  return (
    <div className={`${styles.chatContainer} ${themeClass}`}>
      {/* Chat Messages */}
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

      {/* Predefined Questions */}
      {predefinedQuestions.length > 0 && (
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
      )}

      {/* Model Info
      {modelUsed && (
        <div className={styles.modelInfo}>
          🤖 Powered by: <strong>{modelUsed}</strong>
        </div>
      )} */}

      {/* Input Field */}
      <div className={styles.inputBox}>
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (predefinedQuestions.length > 0) {
              setPredefinedQuestions([]);
            }
          }}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={() => sendMessage()}>Send</button>
      </div>
    </div>
  );
}
