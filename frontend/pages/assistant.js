import { useState, useCallback } from "react";
import axios from "axios";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import Navbar from "../components/Navbar";

/**
 * Assistant (frontend)
 * - Summary (quick/detailed)
 * - Flowchart generation & display (ReactFlow) with simple automatic layout
 * - Quiz generation & submit
 *
 * Uses same endpoints:
 * POST /assistant/summarize/quick
 * POST /assistant/summarize/detailed
 * POST /assistant/flowchart
 * POST /assistant/quiz
 * POST /assistant/quiz/submit
 */

export default function Assistant() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [flowchartData, setFlowchartData] = useState(null); // { nodes: [], edges: [] }
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [section, setSection] = useState("summary");

  // 🧹 Clean markdown / formatting symbols
  const cleanText = (text) => {
    if (!text || typeof text !== "string") return "";
    return text
      .replace(/[#*_`>~\-]+/g, "")
      .replace(/\s{2,}/g, " ")
      .replace(/\n\s*\n/g, "\n")
      .trim();
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setSummary([]);
    setQuiz([]);
    setQuizResults(null);
    setFlowchartData(null);
    setSection("summary");

    if (!uploadedFile) {
      setPreview("");
      return;
    }
    const name = uploadedFile.name.toLowerCase();

    if (name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg")) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(uploadedFile);
    } else {
      setPreview(`📄 ${uploadedFile.name}`);
    }
  };

  const uploadFile = async (endpoint) => {
    if (!file) {
      alert("Please choose a file first.");
      return null;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`http://127.0.0.1:8000/assistant/${endpoint}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 180000,
      });
      return res.data;
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error: " + (err.response?.data?.detail || err.message));
      return null;
    }
  };

  // ---------------- Summary ----------------
  const handleSummarize = async (type) => {
    setLoading(true);
    setSection("summary");
    setSummary([]);
    const data = await uploadFile(`summarize/${type}`);
    if (data?.summary) {
      const cleaned = cleanText(data.summary);
      // Turn into structured sections (heading -> points)
      const lines = cleaned.split(/\n+/).map((l) => l.trim()).filter(Boolean);
      const structured = [];
      let current = { heading: "Overview", points: [] };

      for (let line of lines) {
        // detect headings (line ends with ':') or lines that look like a heading (short + TitleCase)
        if (/[:：]$/.test(line) || (/^[A-Z][A-Za-z0-9\s]{1,60}$/.test(line) && line.split(" ").length <= 6)) {
          if (current.points.length > 0) structured.push(current);
          current = { heading: line.replace(/[:：]$/, ""), points: [] };
        } else {
          const pts = line.split(/(?<=[.!?])\s+/).filter((s) => s.length > 4);
          current.points.push(...pts);
        }
      }
      if (current.points.length > 0) structured.push(current);
      // if structured is empty, fallback to splitting sentences
      if (structured.length === 0 && cleaned.length > 0) {
        const sents = cleaned.match(/[^.!?]+[.!?]/g) || [cleaned];
        structured.push({ heading: "Overview", points: sents.map((s) => s.trim()) });
      }
      setSummary(structured);
    }
    setLoading(false);
  };

  // ---------------- Flowchart ----------------
  // Helper: create readable nodes/edges for ReactFlow and auto-layout top-down
  const layoutFlowchart = useCallback((raw) => {
    if (!raw || !Array.isArray(raw.nodes)) return { nodes: [], edges: [] };

    // Normalize nodes (ensure id & label)
    const nodes = raw.nodes.map((n, i) => {
      const id = (n.id || n._id || `${i}`) + "";
      const label = (n.label || n.text || n.title || `Node ${i + 1}`) + "";
      return { id, label };
    });

    // Normalize edges
    const edges = Array.isArray(raw.edges)
      ? raw.edges.map((e, j) => {
          return {
            id: e.id || `e-${j}`,
            source: (e.source || e.from || edges?.[j]?.source || (nodes[j] && nodes[j].id)) + "",
            target: (e.target || e.to || e.t || nodes[(j + 1) % nodes.length]?.id) + "",
          };
        })
      : [];

    // Build adjacency & indegree for layout
    const adj = {};
    const indeg = {};
    nodes.forEach((n) => {
      adj[n.id] = [];
      indeg[n.id] = 0;
    });
    edges.forEach((e) => {
      if (adj[e.source] && typeof e.target === "string") {
        adj[e.source].push(e.target);
        indeg[e.target] = (indeg[e.target] || 0) + 1;
      }
    });

    // Kahn-like layering (simple top-down)
    const layers = [];
    const q = [];
    Object.keys(indeg).forEach((nid) => {
      if (!indeg[nid] || indeg[nid] === 0) q.push(nid);
    });
    const visited = new Set();
    while (q.length) {
      const layer = [...q];
      layers.push(layer);
      const next = [];
      for (const nid of layer) {
        visited.add(nid);
        for (const nbr of adj[nid] || []) {
          indeg[nbr] = (indeg[nbr] || 1) - 1;
          if (indeg[nbr] === 0) next.push(nbr);
        }
      }
      q.length = 0;
      q.push(...next);
    }
    // Any unvisited nodes -> put at end
    const leftovers = nodes.map((n) => n.id).filter((id) => !visited.has(id));
    if (leftovers.length) layers.push(leftovers);

    // Position nodes: top-down, center horizontally
    const positionedNodes = [];
    const colWidth = 260;
    const rowHeight = 120;
    layers.forEach((layer, rowIdx) => {
      const total = layer.length;
      const startX = 40;
      layer.forEach((nid, idx) => {
        const nodeMeta = nodes.find((x) => x.id === nid);
        const x = startX + idx * colWidth;
        const y = 40 + rowIdx * rowHeight;
        positionedNodes.push({
          id: nid,
          data: { label: nodeMeta.label },
          position: { x, y },
          style: {
            border: "1px solid #a5b4fc",
            borderRadius: 8,
            padding: 8,
            background: "#eef2ff",
            fontSize: 14,
            width: 220,
          },
        });
      });
    });

    const positionedEdges = edges.map((e, i) => ({
      id: e.id || `e-${i}`,
      source: e.source,
      target: e.target,
      animated: true,
      style: { stroke: "#6366f1" },
      markerEnd: { type: "arrowclosed", color: "#6366f1" },
    }));

    return { nodes: positionedNodes, edges: positionedEdges };
  }, []);

  const handleFlowchart = async () => {
    setLoading(true);
    setSection("flowchart");
    setFlowchartData(null);

    const data = await uploadFile("flowchart");
    if (!data) {
      setFlowchartData({ nodes: [], edges: [] });
      setLoading(false);
      return;
    }

    const flow = data.flowchart || data.flow || data; // accept different shapes
    if (flow && Array.isArray(flow.nodes) && flow.nodes.length > 0) {
      const layouted = layoutFlowchart(flow);
      setFlowchartData(layouted);
    } else if (flow && flow.nodes && Array.isArray(flow.nodes) && flow.nodes.length > 0) {
      const layouted = layoutFlowchart(flow);
      setFlowchartData(layouted);
    } else {
      // empty flow — show friendly message
      setFlowchartData({ nodes: [], edges: [] });
      alert("No flowchart nodes generated. Try a different file or try again.");
    }
    setLoading(false);
  };

  // ---------------- Quiz ----------------
  const handleQuizGenerate = async () => {
    setLoading(true);
    setSection("quiz");
    setQuiz([]);
    setQuizAnswers({});
    setQuizResults(null);
    const data = await uploadFile("quiz");
    if (data?.quiz) setQuiz(data.quiz);
    else alert("No quiz generated. Try a different document.");
    setLoading(false);
  };

  const handleSelectOption = (index, option) => {
    setQuizAnswers((prev) => ({ ...prev, [index]: option }));
  };

  const handleQuizSubmit = async () => {
    if (!quiz || quiz.length === 0) {
      alert("No quiz to submit.");
      return;
    }
    const payload = { quiz: quiz, answers: {} };
    quiz.forEach((q, i) => {
      payload.answers[i] = quizAnswers[i] || "";
    });

    try {
      const res = await axios.post("http://localhost:8000/assistant/quiz/submit", payload, {
        headers: { "Content-Type": "application/json" },
      });
      setQuizResults(res.data);
    } catch (err) {
      console.error("Quiz submit error:", err);
      alert("Error submitting quiz: " + (err.response?.data?.detail || err.message));
    }
  };
  
  // ---------------- Render ----------------
return (
         <>
        <Navbar />
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      background: "linear-gradient(180deg, #f9fbff 0%, #eef4ff 100%)",
      minHeight: "100vh",
      fontFamily: "'Poppins', sans-serif",
      color: "#1e293b",
      padding: "40px 70px",
      boxSizing: "border-box",
      transition: "all 0.3s ease",
    }}
  >
    {/* ======= PAGE HEADER ======= */}
    <div
      style={{
        marginBottom: "30px",
        paddingBottom: "10px",
        borderBottom: "2px solid #e2e8f0",
      }}
    >
      <h2
        style={{
          fontSize: "30px",
          fontWeight: 700,
          color: "#0f172a",
          letterSpacing: "-0.5px",
          marginBottom: "6px",
        }}
      >
        🚀 AI Learning Assistant
      </h2>
      <p
        style={{
          color: "#475569",
          fontSize: "15px",
          marginBottom: "5px",
          lineHeight: "1.5",
        }}
      >
        Upload or paste your document to get detailed summaries, flowcharts, and
        interactive quizzes instantly.
      </p>
      <div style={{ fontSize: "13px", color: "#2563eb", fontWeight: 500 }}>
        Dashboard &gt; <span style={{ color: "#1d4ed8" }}>AI Learning Assistant</span>
      </div>
    </div>

    {/* ======= MAIN CONTENT ======= */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "35px",
      }}
    >
      {/* ===== LEFT PANEL ===== */}
      <div
        style={{
          flex: 1,
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 8px 25px rgba(37,99,235,0.08)",
          padding: "30px",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease",
        }}
      >
        {/* Upload Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "2px dashed #93c5fd",
            borderRadius: "14px",
            padding: "14px 18px",
            marginBottom: "22px",
            background: "#f1f5ff",
            transition: "0.3s",
          }}
        >
          <input
            type="file"
            onChange={handleFileChange}
            style={{
              flex: 1,
              fontSize: "14px",
              border: "none",
              background: "transparent",
              color: "#334155",
              outline: "none",
            }}
          />
          <button
            style={{
              background: "linear-gradient(90deg, #2563eb, #3b82f6)",
              color: "white",
              border: "none",
              padding: "10px 24px",
              borderRadius: "30px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 8px 15px rgba(37,99,235,0.25)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(37,99,235,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 15px rgba(37,99,235,0.25)";
            }}
          >
            Upload Document
          </button>
        </div>

        {preview && (
          <div style={{ fontSize: "13px", marginBottom: "10px" }}>
            <strong>📄 Uploaded:</strong> {preview}
          </div>
        )}

        <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "25px" }}>
          Supported formats: PDF, DOCX, PPTX, Images
        </p>

        {/* Buttons Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
            marginTop: "10px",
          }}
        >
          {[
            { label: "Quick Summary", icon: "⚡", onClick: () => handleSummarize("quick") },
            { label: "Detailed Summary", icon: "📘", onClick: () => handleSummarize("detailed") },
            { label: "Flowchart", icon: "🧩", onClick: handleFlowchart },
            { label: "Quiz", icon: "❓", onClick: handleQuizGenerate },
          ].map((btn, i) => (
            <div
              key={i}
              onClick={btn.onClick}
              style={{
                height: "130px",
                background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                borderRadius: "16px",
                color: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 10px 20px rgba(37,99,235,0.25)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 14px 25px rgba(37,99,235,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 20px rgba(37,99,235,0.25)";
              }}
            >
              <div style={{ fontSize: "34px", marginBottom: "8px" }}>{btn.icon}</div>
              {btn.label}
            </div>
          ))}
        </div>
      </div>

      {/* ===== RIGHT PANEL ===== */}
      <div
        style={{
          flex: 1.3,
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 8px 25px rgba(37,99,235,0.08)",
          padding: "30px 35px",
          overflowY: "auto",
          maxHeight: "calc(100vh - 160px)",
          transition: "all 0.3s ease",
        }}
      >
        <h3
          style={{
            color: "#1e40af",
            fontWeight: "600",
            fontSize: "20px",
            marginBottom: "20px",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "6px",
          }}
        >
          {section === "summary"
            ? "📘 Summary"
            : section === "flowchart"
            ? "🧩 Flowchart"
            : section === "quiz"
            ? "📝 Quiz"
            : "Output"}
        </h3>

        {loading && (
          <p style={{ color: "#475569", fontStyle: "italic", marginTop: "10px" }}>
            ⏳ Processing... Please wait.
          </p>
        )}

        {/* ===== SUMMARY ===== */}
        {section === "summary" && summary.length > 0 && (
          <div>
            {summary.map((sec, i) => (
              <div key={i} style={{ marginBottom: "22px" }}>
                <h4
                  style={{
                    color: "#2563eb",
                    marginBottom: "10px",
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                >
                  🔹 {sec.heading}
                </h4>
                <ul style={{ marginLeft: "25px", lineHeight: "1.6" }}>
                  {sec.points.map((pt, j) => (
                    <li key={j} style={{ marginBottom: "6px" }}>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* ===== FLOWCHART ===== */}
        {section === "flowchart" && (
          <div>
            {flowchartData && flowchartData.nodes?.length > 0 ? (
              <div
                style={{
                  height: "550px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  background: "#f8fafc",
                }}
              >
                <ReactFlow nodes={flowchartData.nodes} edges={flowchartData.edges} fitView>
                  <Background />
                  <Controls />
                </ReactFlow>
              </div>
            ) : (
              <div
                style={{
                  height: "200px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "2px dashed #93c5fd",
                  borderRadius: "12px",
                  color: "#64748b",
                  fontSize: "14px",
                  background: "#f9fafb",
                }}
              >
                No flowchart generated yet.
              </div>
            )}
          </div>
        )}

        {/* ===== QUIZ ===== */}
        {section === "quiz" && (
          <div>
            {quiz.map((q, i) => (
              <div
                key={i}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  marginBottom: "15px",
                }}
              >
                <div style={{ fontWeight: "600", marginBottom: "10px" }}>
                  {i + 1}. {q.question}
                </div>
                {["A", "B", "C", "D"].map((opt) => (
                  <label
                    key={opt}
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name={`q-${i}`}
                      value={opt}
                      checked={quizAnswers[i] === opt}
                      onChange={() =>
                        setQuizAnswers((prev) => ({ ...prev, [i]: opt }))
                      }
                      style={{ marginRight: "8px" }}
                    />
                    <strong>{opt}.</strong> {q.options?.[opt] || ""}
                  </label>
                ))}
              </div>
            ))}

            {quiz.length > 0 && (
              <button
                onClick={handleQuizSubmit}
                style={{
                  background: "linear-gradient(90deg, #2563eb, #3b82f6)",
                  color: "white",
                  border: "none",
                  padding: "10px 26px",
                  borderRadius: "30px",
                  fontWeight: "600",
                  cursor: "pointer",
                  marginTop: "10px",
                  boxShadow: "0 6px 14px rgba(37,99,235,0.25)",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(37,99,235,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 6px 14px rgba(37,99,235,0.25)";
                }}
              >
                ✅ Submit Quiz
              </button>
            )}
{quizResults && (
  <div
    style={{
      marginTop: "25px",
      background: "#f0fdf4",
      border: "1px solid #10b981",
      borderRadius: "14px",
      padding: "20px",
      color: "#065f46",
      fontWeight: "500",
    }}
  >
    <h4 style={{ marginBottom: "12px", color: "#047857", fontSize: "18px" }}>
      🧠 Quiz Results
    </h4>
    <p style={{ marginBottom: "12px" }}>
      <strong>Score:</strong> {quizResults.score} / {quizResults.total}
    </p>

    {quizResults.results && quizResults.results.length > 0 && (
      <div>
        {quizResults.results.map((r, i) => (
          <div
            key={i}
            style={{
              background: r.user === r.correct ? "#dcfce7" : "#fee2e2",
              border: `1px solid ${r.user === r.correct ? "#22c55e" : "#ef4444"}`,
              borderRadius: "10px",
              padding: "12px 15px",
              marginBottom: "10px",
            }}
          >
            <div style={{ fontWeight: 600, color: "#1e293b" }}>
              {i + 1}. {r.question}
            </div>
            <div>
              ✅ Correct Answer:{" "}
              <span style={{ color: "#15803d", fontWeight: 600 }}>{r.correct}</span>
            </div>
            <div>
              🧍 Your Answer:{" "}
              <span
                style={{
                  color: r.user === r.correct ? "#15803d" : "#b91c1c",
                  fontWeight: 600,
                }}
              >
                {r.user || "Not answered"}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}


          </div>
        )}
      </div>
    </div>
  </div>
  </>
);
}