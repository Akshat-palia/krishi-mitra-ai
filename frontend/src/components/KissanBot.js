import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const KissanBot = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isTyping]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    // Add user message
    setChat((prev) => [...prev, { sender: "user", text: userMessage }]);
    setMessage("");
    setIsTyping(true);

    try {
      const res = await axios.post("http://localhost:8000/chat", {
        user_input: userMessage,
        lang: "en",
      });

      // Small delay to feel natural
      setTimeout(() => {
        setIsTyping(false);
        setChat((prev) => [
          ...prev,
          { sender: "bot", text: res.data.response },
        ]);
      }, 800);

    } catch (err) {
      setIsTyping(false);
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "Kissan Bot is unavailable right now." },
      ]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-2xl cursor-pointer hover:scale-110 transition-transform z-50"
      >
        👳‍🌾
      </div>

      {/* Chat Card */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col z-50 border border-white/20 animate-fadeIn">

          {/* Header */}
          <div className="bg-emerald-600 text-white px-4 py-3 rounded-t-2xl font-semibold flex items-center gap-2">
            👳‍🌾 Kissan Bot
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto max-h-80 space-y-3">
            {chat.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Ask me about crops, soil, pests or market 🌾
              </p>
            )}

            {chat.map((msg, i) => (
              <div
                key={i}
                className={`text-sm p-2 rounded-xl max-w-[75%] ${
                  msg.sender === "user"
                    ? "ml-auto bg-emerald-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="text-sm p-2 rounded-xl bg-gray-200 dark:bg-gray-700 dark:text-white max-w-[75%] flex gap-1">
                <span className="animate-bounce">•</span>
                <span className="animate-bounce delay-150">•</span>
                <span className="animate-bounce delay-300">•</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-2xl">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask something..."
              className="flex-1 p-3 text-sm bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
            />
            <button
              onClick={sendMessage}
              className="px-4 text-emerald-600 dark:text-emerald-400 font-semibold"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default KissanBot;