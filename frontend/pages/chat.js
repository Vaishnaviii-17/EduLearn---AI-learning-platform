// frontend/pages/chat.js
import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // connect to backend Socket.IO server
    socket = io("http://127.0.0.1:8000", {
      transports: ["websocket"], // ensures proper connection with FastAPI + uvicorn
    });

    socket.on("connect", () => {
      console.log("✅ Connected to backend");
    });

    socket.on("server_message", (data) => {
      setMessages((prev) => [...prev, { sender: "Server", text: data.msg }]);
    });

    socket.on("chat_message", (data) => {
      setMessages((prev) => [...prev, { sender: "User", text: data.text }]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("chat_message", { text: input });
      setInput("");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>💬 Chat with AI SuperApp</h2>
      <div style={{ border: "1px solid #ccc", padding: 10, height: 300, overflowY: "scroll" }}>
        {messages.map((msg, i) => (
          <div key={i}><b>{msg.sender}:</b> {msg.text}</div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
