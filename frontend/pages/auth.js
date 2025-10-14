"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await axios.post("http://127.0.0.1:8000/auth/login", form);
      } else {
        await axios.post("http://127.0.0.1:8000/auth/signup", form);
      }
      router.push("/avatar");
    } catch (error) {
      alert("Authentication failed");
    }
  };

  return (
    <div style={styles.container}>
      {/* Left side with logo */}
      <div style={styles.leftPanel}>
        <img src="/icons/logo.png" alt="EduLearn Logo" style={styles.logo} />
        <h1 style={styles.brand}>EduLearn AI</h1>
        <p style={styles.tagline}>Your AI Learning Companion</p>
      </div>

      {/* Right side form */}
      <div style={styles.rightPanel}>
        <div style={styles.tabs}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              ...styles.tab,
              borderBottom: isLogin ? "2px solid #2563eb" : "none",
              color: isLogin ? "#2563eb" : "#6b7280",
            }}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              ...styles.tab,
              borderBottom: !isLogin ? "2px solid #2563eb" : "none",
              color: !isLogin ? "#2563eb" : "#6b7280",
            }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              style={styles.input}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={styles.input}
            required
          />

          <div style={styles.options}>
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" style={styles.forgotPassword}>
              Forgot password?
            </a>
          </div>

          <button type="submit" style={styles.submitButton}>
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Poppins, sans-serif",
  },
  leftPanel: {
    flex: 1,
    background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "90px",
    height: "90px",
    borderRadius: "20px",
    marginBottom: "20px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
    background: "white",
    padding: "10px",
  },
  brand: {
    fontSize: "32px",
    fontWeight: "700",
  },
  tagline: {
    fontSize: "16px",
    opacity: 0.9,
  },
  rightPanel: {
    flex: 1,
    backgroundColor: "#f9fafb",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: "20px",
    borderBottomLeftRadius: "20px",
    boxShadow: "0 0 20px rgba(0,0,0,0.1)",
  },
  tabs: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    marginBottom: "20px",
  },
  tab: {
    padding: "10px 20px",
    background: "none",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "600",
  },
  form: {
    width: "70%",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "14px",
  },
  options: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    alignItems: "center",
  },
  forgotPassword: {
    color: "#2563eb",
    textDecoration: "none",
  },
  submitButton: {
    marginTop: "10px",
    background: "#2563eb",
    color: "white",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.3s",
  },
};
