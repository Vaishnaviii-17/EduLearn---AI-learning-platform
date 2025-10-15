import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Explainer() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [features, setFeatures] = useState([]);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const cleanMarkdown = (text) => {
    if (!text) return "";
    return text
      .replace(/[*#`_>]/g, "")
      .replace(/\n{2,}/g, "\n")
      .replace(/\n/g, "<br/>")
      .trim();
  };

  const handleExplain = async () => {
    if (!code.trim()) {
      alert("Please enter some code first.");
      return;
    }
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/explainer/explain", { code });
      setLanguage(res.data.language || "Unknown");
      setFeatures(res.data.features || []);
      setExplanation(cleanMarkdown(res.data.explanation || "No explanation available."));
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || err.message));
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#f9fafc",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px 60px",
            borderBottom: "1px solid #e5e7eb",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#1e293b" }}>
            🧠 Code Explainer
          </h1>
          <p style={{ color: "#475569", fontSize: "15px" }}>
            Upload or paste your code to get explanations and improvements
          </p>
        </div>

        {/* Main Section */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            padding: "40px 60px",
            flex: 1,
          }}
        >
          {/* Left: Code Input */}
          <div
            style={{
              flex: 1.2,
              backgroundColor: "#0f172a",
              color: "#f8fafc",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <div style={{ display: "flex", gap: "8px" }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: "#ef4444",
                    borderRadius: "50%",
                  }}
                />
                <span
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: "#facc15",
                    borderRadius: "50%",
                  }}
                />
                <span
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: "#22c55e",
                    borderRadius: "50%",
                  }}
                />
              </div>
            </div>

            <textarea
              rows="18"
              placeholder="Paste your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{
                width: "100%",
                height: "80%",
                backgroundColor: "#0f172a",
                color: "#e2e8f0",
                fontFamily: "monospace",
                fontSize: "15px",
                border: "none",
                outline: "none",
                resize: "none",
              }}
            />

            <button
              onClick={handleExplain}
              style={{
                marginTop: "20px",
                background: "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                fontWeight: "600",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Explain Code
            </button>
            {loading && (
              <p style={{ color: "#94a3b8", marginTop: 10 }}>
                ⏳ Analyzing code...
              </p>
            )}
          </div>

          {/* Right: Explanation */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              padding: "20px 24px",
              boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
              overflowY: "auto",
            }}
          >
            {!loading && explanation && (
              <>
                <h2
                  style={{
                    fontSize: "20px",
                    color: "#1e293b",
                    marginBottom: "10px",
                  }}
                >
                  🧠 Code Explanation
                </h2>

                {language && (
                  <>
                    <p
                      style={{
                        color: "#475569",
                        fontSize: "15px",
                        marginBottom: "6px",
                      }}
                    >
                      🧠 Detected Language:
                    </p>
                    <p
                      style={{
                        backgroundColor: "#e0f2fe",
                        color: "#0369a1",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        display: "inline-block",
                      }}
                    >
                      {language}
                    </p>
                  </>
                )}

                {features.length > 0 && (
                  <>
                    <h3 style={{ marginTop: 20, color: "#1e293b" }}>
                      🧩 Key Features:
                    </h3>
                    <ul style={{ lineHeight: 1.8, marginTop: 6 }}>
                      {features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </>
                )}

                <h3 style={{ marginTop: 20, color: "#1e293b" }}>📝 Explanation:</h3>
                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "14px",
                    fontSize: "15px",
                    color: "#0f172a",
                    lineHeight: 1.7,
                  }}
                  dangerouslySetInnerHTML={{ __html: explanation }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
