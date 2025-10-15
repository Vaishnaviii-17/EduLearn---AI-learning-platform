// frontend/pages/chat.js
"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { fetchData } from "@/utils/api";

let socket;

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // ✅ Connect to deployed backend (or localhost during dev)
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Connected to backend via Socket.IO");
    });

    socket.on("server_message", (data) => {
      setMessages((prev) => [...prev, { sender: "Server", text: data.msg }]);
    });

    socket.on("chat_message", (data) => {
      setMessages((prev) => [...prev, { sender: "User", text: data.text }]);
    });

    // ✅ Fetch data example
    async function loadUsers() {
      try {
        const data = await fetchData("api/users");
        console.log("Fetched users:", data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    }
    loadUsers();

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("chat_message", { text: input });
      setMessages((prev) => [...prev, { sender: "You", text: input }]);
      setInput("");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>💬 Chat with AI SuperApp</h2>
      <div
        style={{
          border: "1px solid #ccc",
          padding: 10,
          height: 300,
          overflowY: "scroll",
        }}
      >
        {messages.map((msg, i) => (
          <div key={i}>
            <b>{msg.sender}:</b> {msg.text}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

