import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const res = await axios.post("http://localhost:8000/chat", {
        user_input: message,
        lang: "en"
      });

      setChat([
        ...chat,
        { sender: "user", text: message },
        { sender: "bot", text: res.data.response }
      ]);

      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🌾 Smart Farming Assistant</h2>

      <div style={{ minHeight: "300px", border: "1px solid gray", padding: "10px" }}>
        {chat.map((msg, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <strong>{msg.sender === "user" ? "You" : "AI"}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask about crops, soil, pests..."
        style={{ width: "70%", padding: "8px" }}
      />

      <button onClick={sendMessage} style={{ padding: "8px 15px", marginLeft: "10px" }}>
        Send
      </button>
    </div>
  );
};

export default Chatbot;