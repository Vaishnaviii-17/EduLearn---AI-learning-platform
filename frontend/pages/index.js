"use client"
import Link from "next/link"
import React from "react"

export default function Home() {
  return (
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)",
        minHeight: "100vh",
        color: "#111",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 80px",
          background: "transparent",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "1.2rem",
            fontWeight: "700",
            color: "#111",
          }}
        >
          <img
            src="/icons/logo.png"
            alt="logo"
            style={{ width: 35, height: 35, marginRight: 10 }}
          />
          EduLearn <span style={{ color: "#2563eb", marginLeft: 5 }}>AI</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "30px",
            fontSize: "0.95rem",
            color: "#374151",
          }}
        >
          <a href="#" style={{ textDecoration: "none", color: "#111" }}>
            Features
          </a>
          <a href="#" style={{ textDecoration: "none", color: "#111" }}>
            How It Works
          </a>
          <a href="#" style={{ textDecoration: "none", color: "#111" }}>
            Pricing
          </a>
          <a href="#" style={{ textDecoration: "none", color: "#111" }}>
            About
          </a>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              style={{
                background: "transparent",
                border: "1px solid #2563eb",
                color: "#2563eb",
                borderRadius: "8px",
                padding: "8px 16px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Login
            </button>
            <button
              style={{
                background: "#2563eb",
                border: "none",
                color: "white",
                borderRadius: "8px",
                padding: "8px 16px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          padding: "80px 100px",
          gap: "50px",
        }}
      >
        {/* Left Text */}
        <div style={{ flex: "1 1 450px" }}>
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "700",
              lineHeight: "1.3",
              marginBottom: "15px",
              color: "#111",
            }}
          >
            Transform Your <br /> Learning with{" "}
            <span style={{ color: "#2563eb" }}>AI</span>
          </h1>
          <p
            style={{
              color: "#4b5563",
              fontSize: "1.1rem",
              marginBottom: "30px",
              maxWidth: "450px",
            }}
          >
            Personalized education tools powered by artificial intelligence.
          </p>

          <div style={{ display: "flex", gap: "15px" }}>
            <Link href="/auth">
              <button
                style={{
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "14px 28px",
                  borderRadius: "10px",
                  fontSize: "1rem",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Get Started
              </button>
            </Link>
            <button
              style={{
                background: "white",
                color: "#2563eb",
                border: "2px solid #2563eb",
                padding: "14px 28px",
                borderRadius: "10px",
                fontSize: "1rem",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div style={{ flex: "1 1 400px", textAlign: "center" }}>
          <img
            src="/ai-learning-illustration.png"
            alt="AI Illustration"
            style={{ width: "100%", maxWidth: "450px" }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "30px",
          padding: "0 100px 80px",
        }}
      >
        {/* Card 1 */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "30px",
            textAlign: "center",
            boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)"
            e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.08)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.05)"
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "10px" }}>🧠</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#111" }}>
            AI Learning Assistant
          </h3>
          <p style={{ color: "#6b7280", fontSize: "0.95rem", marginTop: "10px" }}>
            Personalized education tools powered by artificial intelligence.
          </p>
        </div>

        {/* Card 2 */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "30px",
            textAlign: "center",
            boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)"
            e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.08)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.05)"
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "10px" }}>💬</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#111" }}>
            Virtual Mentor
          </h3>
          <p style={{ color: "#6b7280", fontSize: "0.95rem", marginTop: "10px" }}>
            Teachers linked through intelligent AI tutoring systems.
          </p>
        </div>

        {/* Card 3 */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "30px",
            textAlign: "center",
            boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)"
            e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.08)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.05)"
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "10px" }}>💻</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#111" }}>
            Code Explainer
          </h3>
          <p style={{ color: "#6b7280", fontSize: "0.95rem", marginTop: "10px" }}>
            Review and understand your code through AI explanations.
          </p>
        </div>
      </section>
    </div>
  )
}
