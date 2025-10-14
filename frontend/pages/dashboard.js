"use client";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const router = useRouter();

  return (
    <>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.main}>
          <div style={styles.header}>
            <h1 style={styles.heading}>User Dashboard</h1>
            <p style={styles.subText}>Welcome back !!</p>
          </div>

          <h2 style={styles.quickAccess}>Quick Access</h2>

          <div style={styles.cardsRow}>
            {/* --- Assistant --- */}
            <div style={styles.card}>
              <img
                src="/icons/assistant.png"
                alt="AI Assistant"
                style={styles.cardIcon}
              />
              <h3 style={styles.cardTitle}>AI Learning Assistant</h3>
              <p style={styles.cardText}>
                Review descriptions and get personalized assistance.
              </p>
              <button
                style={styles.launchBtn}
                onClick={() => router.push("/assistant")}
              >
                Launch
              </button>
            </div>

            {/* --- Explainer --- */}
            <div style={styles.card}>
              <img
                src="/icons/explainer.png"
                alt="Code Explainer"
                style={styles.cardIcon}
              />
              <h3 style={styles.cardTitle}>Code Explainer</h3>
              <p style={styles.cardText}>
                Get AI-powered explanations and insights into your code.
              </p>
              <button
                style={styles.launchBtn}
                onClick={() => router.push("/explainer")}
              >
                Launch
              </button>
            </div>

            {/* --- Mentor --- */}
            <div style={styles.card}>
              <img
                src="/icons/mentor.png"
                alt="Virtual Mentor"
                style={styles.cardIcon}
              />
              <h3 style={styles.cardTitle}>Virtual Mentor</h3>
              <p style={styles.cardText}>
                Connect with AI mentors for guided learning sessions.
              </p>
              <button
                style={styles.launchBtn}
                onClick={() => router.push("/mentor")}
              >
                Launch
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ===== STYLES ===== */
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    fontFamily: "Poppins, sans-serif",
    backgroundColor: "#f9fbff",
    minHeight: "100vh",
    paddingTop: "80px",
  },

  main: {
    width: "95%",
    maxWidth: "1200px",
    textAlign: "center",
  },

  header: {
    marginBottom: "25px",
  },

  heading: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "5px",
    color: "#0f172a",
  },

  subText: {
    fontSize: "15px",
    color: "#6b7280",
  },

  quickAccess: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "40px",
    color: "#1e3a8a",
  },

  cardsRow: {
    display: "flex",
    justifyContent: "space-between", // ✅ evenly spread
    alignItems: "stretch",
    gap: "25px",
    flexWrap: "nowrap", // ✅ forces one row
  },

  card: {
    background: "#fff",
    borderRadius: "22px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    padding: "35px 25px",
    width: "30%", // ✅ makes all three fit in one row
    textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },

  cardIcon: {
    width: "90px",
    height: "90px",
    marginBottom: "20px",
  },

  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
  },

  cardText: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "25px",
  },

  launchBtn: {
    background: "linear-gradient(90deg, #2563eb, #3b82f6)",
    color: "white",
    border: "none",
    borderRadius: "25px",
    padding: "10px 30px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
  },
};
