"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const storedAvatar = localStorage.getItem("userAvatar");
    if (storedAvatar) setAvatar(storedAvatar);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    alert("User logged out successfully");
    router.push("/");
  };

  return (
    <div style={styles.navbar}>
      {/* Left: Logo + EduLearn */}
      <div style={styles.leftSection}>
        <img src="/icons/logo.png" alt="EduLearn Logo" style={styles.logo} />
        <h1 style={styles.brand}>EduLearn AI</h1>
      </div>

      {/* Right: Back to Dashboard + Logout + Avatar */}
      <div style={styles.rightSection}>
        <button
          style={{
            ...styles.navButton,
            ...(hovered === "dashboard" ? styles.navButtonHover : {}),
          }}
          onMouseEnter={() => setHovered("dashboard")}
          onMouseLeave={() => setHovered(false)}
          onClick={() => router.push("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <button
          style={{
            ...styles.navButton,
            background: "rgba(255,255,255,0.25)",
            ...(hovered === "logout" ? styles.logoutHover : {}),
          }}
          onMouseEnter={() => setHovered("logout")}
          onMouseLeave={() => setHovered(false)}
          onClick={handleLogout}
        >
          ⎋ Logout
        </button>

        {avatar && (
          <img
            src={avatar}
            alt="User Avatar"
            style={styles.avatar}
            onClick={() => router.push("/avatar")}
          />
        )}
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    width: "100%",
    height: "65px",
    background: "linear-gradient(90deg, #2563eb, #1e3a8a)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    borderBottomLeftRadius: "12px",
    borderBottomRightRadius: "12px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  leftSection: { display: "flex", alignItems: "center", gap: "12px" },
  rightSection: { display: "flex", alignItems: "center", gap: "16px" },

  logo: { width: "40px", height: "40px", objectFit: "contain" },
  brand: { fontSize: "22px", fontWeight: "700" },

  navButton: {
    background: "rgba(255,255,255,0.15)",
    border: "none",
    color: "white",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.3s ease",
  },
  navButtonHover: {
    background: "#3b82f6",
    boxShadow: "0 0 10px rgba(59,130,246,0.5)",
    transform: "translateY(-1px)",
  },
  logoutHover: {
    background: "#ef4444",
    boxShadow: "0 0 10px rgba(239,68,68,0.5)",
    transform: "translateY(-1px)",
  },

  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    cursor: "pointer",
    border: "2px solid white",
    transition: "transform 0.2s ease",
  },
};
