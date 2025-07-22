import { useEffect, useRef, useState } from "react";
import styles from "./ChatBox.module.css";
import { staticQA } from "./chatData.js";
// import { useMutation, useQuery } from "convex/react";
// import { api } from "../../../convex/_generated/api";

const chatId = "support_chat_1";

const ChatBox = () => {
  const addMessage = useMutation(api.messages.add);
  const fetchedMessages = useQuery(api.messages.getMessagesByChatId, {
    chatId,
  });
  const deleteMessages = useMutation(api.messages.deleteMessagesByChatId);

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

  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (hasInitializedRef.current) return;

    if (fetchedMessages?.length > 0) {
      setMessages(fetchedMessages);
    } else {
      const welcome = {
        sender: "bot",
        text: "👋 Hi there! I'm your assistant. Ask me something or tap a quick question below.",
        time: getTime(),
      };
      setMessages([welcome]);
      addMessage({ sender: "bot", text: welcome.text, chatId });
    }

    hasInitializedRef.current = true;
  }, [fetchedMessages]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  const handleSend = async (text) => {
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

    await addMessage({ sender: "user", text: userMsg.text, chatId });

    setTimeout(async () => {
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
      await addMessage({ sender: "bot", text: botMsg.text, chatId });

      setIsTyping(false);

      if (isQuickReply) {
        setAvailableButtons((prev) => prev.filter((btn) => btn !== question));
        if (availableButtons.length <= 1) setShowQuickReplies(false);
      }
    }, 1000); // ⏱ 1 second delay
  };

  const handleClearChat = async () => {
    await deleteMessages({ chatId });
    const welcome = {
      sender: "bot",
      text: "👋 Hi there! I'm your assistant. Ask me something or tap a quick question below.",
      time: getTime(),
    };
    setMessages([welcome]);
    await addMessage({ sender: "bot", text: welcome.text, chatId });
    setAvailableButtons(quickReplies);
    setShowQuickReplies(true);
    setIsTyping(false);
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatBox} ref={containerRef}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={msg.sender === "user" ? styles.userMsg : styles.botMsg}
          >
            <div>{msg.text}</div>
            <div className={styles.timeStamp}>{msg.time}</div>
          </div>
        ))}

        {isTyping && (
          <div className={styles.botMsg}>
            <div className={styles.typingDots}>
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

      <div style={{ textAlign: "center" }}>
        <button onClick={handleClearChat} className={styles.endChatBtn}>
          End Chat
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
