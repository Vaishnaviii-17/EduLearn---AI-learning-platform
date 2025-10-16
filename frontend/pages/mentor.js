import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Navbar from "../components/Navbar";

export default function VirtualMentor() {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 🧑‍🏫 Predefined avatars
  const avatars = [
    {
      name: "Professor Ada",
      img: "/avatar/avatar1.png",
      personality: "A wise professor who explains complex topics simply.",
      voice: "Google UK English Female",
    },
    {
      name: "Tech Mentor Alex",
      img: "/avatar/avatar2.png",
      personality: "A friendly AI who focuses on coding, AI, and logic.",
      voice: "Google US English Male",
    },
    {
      name: "Study Buddy Zoe",
      img: "/avatar/avatar3.png",
      personality: "A cheerful mentor who helps with quick summaries and motivation.",
      voice: "Google UK English Female",
    },
    {
      name: "Motivator Max",
      img: "/avatar/avatar4.png",
      personality: "An energetic guide who motivates and simplifies everything!",
      voice: "Google US English Male",
    },
  ];

  // 🔊 Text-to-speech
  const speak = (text, voicePref) => {
    if (!window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    const voices = synth.getVoices();
    const selectedVoice = voices.find((v) => v.name === voicePref);
    if (selectedVoice) utter.voice = selectedVoice;
    synth.speak(utter);
  };

  // 🧠 Send message to backend
  const sendMessage = async () => {
    if (!input.trim() || !selectedAvatar) return;

    const userMsg = { sender: "user", text: input };
    setChat((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("${process.env.NEXT_PUBLIC_API_URL}/mentor/chat", null, {
        params: { message: `${selectedAvatar.personality}\n\nStudent: ${userMsg.text}` },
      });

      const aiMsg = { sender: "mentor", text: res.data.reply };
      setChat((prev) => [...prev, aiMsg]);
      speak(res.data.reply, selectedAvatar.voice);
    } catch (err) {
      console.error(err);
      alert("Error: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  // 🎙️ Voice input
  const handleVoiceInput = () => {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Your browser doesn't support voice input. Please use Chrome or Edge.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => console.log("🎤 Listening...");
      recognition.onresult = (event) => {
        const voiceText = event.results[0][0].transcript;
        console.log("🎙️ You said:", voiceText);
        setInput(voiceText);
        setTimeout(() => sendMessage(), 600);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        alert("Speech recognition error: " + event.error);
      };

      recognition.onend = () => console.log("🛑 Voice input ended.");
      recognition.start();
    } catch (error) {
      console.error("🎤 Voice input failed:", error);
      alert("Microphone error: " + error.message);
    }
  };

  // -------------------------
  // UI
  // -------------------------
return (
       <>
      <Navbar />
  <div
    style={{
      display: "flex",
      height: "100vh",
      fontFamily: "Inter, sans-serif",
      backgroundColor: "#ffffff",
      overflow: "hidden",
    }}
  >
    {/* LEFT: Mentor Selection */}
    <div
      style={{
        flex: "0 0 40%",
        background: "linear-gradient(180deg, #ffffff 0%, #f5f8ff 100%)",
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h2
        style={{
          fontSize: "28px",
          fontWeight: "700",
          color: "#111827",
          marginBottom: "30px",
        }}
      >
        Choose your mentor
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {avatars.map((a, i) => (
          <div
            key={i}
            onClick={() => setSelectedAvatar(a)}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              background:
                i === 0
                  ? "linear-gradient(90deg, #3b82f6, #60a5fa)"
                  : i === 1
                  ? "linear-gradient(90deg, #10b981, #6ee7b7)"
                  : i === 2
                  ? "linear-gradient(90deg, #8b5cf6, #a78bfa)"
                  : "linear-gradient(90deg, #f97316, #fb923c)",
              borderRadius: "14px",
              padding: "16px 20px",
              color: "white",
              boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 10px 22px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.1)";
            }}
          >
            <img
              src={a.img}
              alt={a.name}
              style={{
                width: 55,
                height: 55,
                borderRadius: "50%",
                marginRight: "18px",
                border: "2px solid rgba(255,255,255,0.6)",
              }}
            />
            <div style={{ textAlign: "left" }}>
              <h3 style={{ fontSize: "17px", fontWeight: "600", margin: 0 }}>{a.name}</h3>
              <p
                style={{
                  fontSize: "13px",
                  margin: 0,
                  opacity: 0.9,
                }}
              >
                {a.personality}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* RIGHT: Chat Interface */}
    <div
      style={{
        flex: 1,
        backgroundColor: "#fafafa",
        display: "flex",
        flexDirection: "column",
        padding: "25px 40px",
      }}
    >
      {selectedAvatar ? (
        <>
          {/* Chat Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
              borderBottom: "1px solid #e5e7eb",
              paddingBottom: "15px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={selectedAvatar.img}
                alt={selectedAvatar.name}
                style={{
                  width: 55,
                  height: 55,
                  borderRadius: "50%",
                  marginRight: 14,
                }}
              />
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#111827" }}>
                  {selectedAvatar.name}
                </h3>
                <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
                  {selectedAvatar.personality}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedAvatar(null)}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
                color: "#6b7280",
              }}
            >
              ⟲
            </button>
          </div>

          {/* Chat Window */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              background: "#fff",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "inset 0 0 8px rgba(0,0,0,0.05)",
              marginBottom: "15px",
            }}
          >
            {chat.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                  margin: "10px 0",
                }}
              >
                {msg.sender !== "user" && (
                  <img
                    src={selectedAvatar.img}
                    alt="mentor"
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: "50%",
                      marginRight: 10,
                    }}
                  />
                )}
                <div
                  style={{
                    background:
                      msg.sender === "user" ? "#e0e7ff" : "#f3f4f6",
                    color: "#111827",
                    padding: "10px 14px",
                    borderRadius:
                      msg.sender === "user"
                        ? "16px 16px 4px 16px"
                        : "16px 16px 16px 4px",
                    maxWidth: "70%",
                    fontSize: "14px",
                    lineHeight: "1.5",
                  }}
                >
                  <ReactMarkdown children={msg.text} remarkPlugins={[remarkGfm]} />
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "white",
              borderRadius: "40px",
              padding: "8px 16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "15px",
                color: "#111827",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "#2563eb",
                marginRight: "10px",
              }}
            >
              📨
            </button>
            <button
              onClick={handleVoiceInput}
              style={{
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                border: "none",
                color: "white",
                fontSize: "18px",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                cursor: "pointer",
              }}
            >
              🎤
            </button>
          </div>
        </>
      ) : (
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#9ca3af",
            fontSize: "16px",
          }}
        >
          👈 Select a mentor to start chatting
        </div>
      )}
    </div>
  </div>
  </>
);
}