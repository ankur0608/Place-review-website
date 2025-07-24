import { useEffect, useRef, useState } from "react";
import styles from "./ChatBox.module.css";
import { staticQA } from "./chatData.js";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef(null);

  const quickReplies = Object.keys(staticQA).filter((key) => {
    const l = key.toLowerCase();
    return !["date", "time", "hello", "what is your name", "thank you"].some(
      (k) => l.includes(k)
    );
  });

  const [availableButtons, setAvailableButtons] = useState(quickReplies);
  const [showQuickReplies, setShowQuickReplies] = useState(true);

  const getTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    const welcome = {
      sender: "bot",
      text: "👋 Hi there! I'm your assistant. Ask me something or tap a quick question below.",
      time: getTime(),
    };
    setMessages([welcome]);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  const handleSend = (text) => {
    const question = (text || input).trim().toLowerCase();
    if (!question) return;

    const isQuickReply = !!text;
    const userMsg = {
      sender: "user",
      text: text || input,
      time: getTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const answerRaw = staticQA[question];
      const answer =
        typeof answerRaw === "function"
          ? answerRaw()
          : answerRaw || "❌ I don't have an answer for that yet.";

      const botMsg = {
        sender: "bot",
        text: answer,
        time: getTime(),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);

      if (isQuickReply) {
        setAvailableButtons((prev) => prev.filter((btn) => btn !== question));
        if (availableButtons.length <= 1) setShowQuickReplies(false);
      }
    }, 1000);
  };

  const handleClearChat = () => {
    const welcome = {
      sender: "bot",
      text: "👋 Hi there! I'm your assistant. Ask me something or tap a quick question below.",
      time: getTime(),
    };
    setMessages([welcome]);
    setAvailableButtons(quickReplies);
    setShowQuickReplies(true);
    setIsTyping(false);
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <h3>Assistant</h3>
        <button onClick={handleClearChat} className={styles.endChatBtn}>
          End Chat
        </button>
      </div>

      <div className={styles.chatBox} ref={containerRef}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={msg.sender === "user" ? styles.userMsg : styles.botMsg}
          >
            <div className={styles.messageBubble}>{msg.text}</div>
            <div className={styles.timeStamp}>{msg.time}</div>
          </div>
        ))}

        {isTyping && (
          <div className={styles.botMsg}>
            <div className={`${styles.messageBubble} ${styles.typingDots}`}>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        )}

        {showQuickReplies && availableButtons.length > 0 && (
          <div className={styles.botMsg}>
            <div className={styles.botHeader}>Quick Questions:</div>
            <div className={styles.quickReplies}>
              {availableButtons.map((q, i) => (
                <button
                  key={i}
                  className={styles.predefinedBtn}
                  onClick={() => handleSend(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.inputBox}>
        <input
          type="text"
          value={input}
          placeholder="Type your message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={() => handleSend()}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
