import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        await axios.post("${process.env.NEXT_PUBLIC_API_URL}/auth/login", {
          email: form.email,
          password: form.password,
        });
        alert("Login success!");
        router.push("/dashboard");
      } else {
        await axios.post("${process.env.NEXT_PUBLIC_API_URL}/auth/signup", form);
        alert("Signup success!");
        router.push("/dashboard");
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || err.message));
    }
  };

  const styles = {
    container: {
      display: "flex",
      height: "100vh",
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: "#f4f7fb",
    },
    left: {
      flex: 1.2,
      background: "linear-gradient(135deg, #0072ff 0%, #00c6ff 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      padding: "20px",
    },
    logoBox: { textAlign: "center" },
    logoIcon: {
      background: "white",
      color: "#007bff",
      fontSize: "2rem",
      fontWeight: "bold",
      width: "70px",
      height: "70px",
      borderRadius: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 20px auto",
      boxShadow: "0 3px 8px rgba(255,255,255,0.3)",
    },
    logoTitle: {
      fontSize: "1.8rem",
      fontWeight: "600",
      marginBottom: "6px",
    },
    logoSubtitle: {
      fontSize: "0.95rem",
      opacity: 0.9,
    },
    right: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "white",
    },
    card: {
      width: "370px",
      background: "white",
      borderRadius: "18px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
      padding: "35px 40px",
    },
    tabs: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "25px",
    },
    tabBtn: (active) => ({
      flex: 1,
      background: "none",
      border: "none",
      fontSize: "1.1rem",
      paddingBottom: "8px",
      cursor: "pointer",
      borderBottom: active ? "2px solid #007bff" : "2px solid transparent",
      color: active ? "#007bff" : "#666",
      fontWeight: active ? "600" : "500",
      transition: "0.3s",
    }),
    input: {
      width: "100%",
      padding: "12px 14px",
      marginBottom: "15px",
      borderRadius: "8px",
      border: "1px solid #dfe3eb",
      background: "#f6f8fc",
      fontSize: "0.95rem",
      outline: "none",
      transition: "0.3s",
    },
    inputFocus: { borderColor: "#007bff", background: "white" },
    passwordWrapper: { position: "relative" },
    showBtn: {
      position: "absolute",
      right: "12px",
      top: "11px",
      cursor: "pointer",
      color: "#007bff",
      fontSize: "0.85rem",
      background: "none",
      border: "none",
    },
    options: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "0.85rem",
      marginBottom: "18px",
    },
    forgot: { color: "#007bff", textDecoration: "none" },
    submit: {
      width: "100%",
      padding: "12px",
      background: "#007bff",
      border: "none",
      borderRadius: "8px",
      color: "white",
      fontSize: "1rem",
      cursor: "pointer",
      marginBottom: "22px",
      fontWeight: "500",
      boxShadow: "0 3px 10px rgba(0,123,255,0.3)",
      transition: "0.3s",
    },
    divider: {
      textAlign: "center",
      color: "#888",
      fontSize: "0.9rem",
      marginBottom: "15px",
    },
    socials: {
      display: "flex",
      justifyContent: "center",
      gap: "15px",
    },
    socialIcon: {
      width: "32px",
      height: "32px",
      cursor: "pointer",
      borderRadius: "50%",
      transition: "transform 0.2s",
    },
    responsive: `
      @media(max-width: 850px) {
        .auth-wrapper {
          flex-direction: column;
        }
      }
    `,
  };

  return (
    <>
      <style>{styles.responsive}</style>
      <div className="auth-wrapper" style={styles.container}>
        {/* LEFT SIDE */}
        <div style={styles.left}>
          <div style={styles.logoBox}>
            <div style={styles.logoIcon}>E</div>
            <div style={styles.logoTitle}>EduLearn AI</div>
            <div style={styles.logoSubtitle}>Your AI Learning Companion</div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div style={styles.right}>
          <div style={styles.card}>
            {/* Tabs */}
            <div style={styles.tabs}>
              <button
                style={styles.tabBtn(isLogin)}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                style={styles.tabBtn(!isLogin)}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <div>
              {!isLogin && (
                <input
                  style={styles.input}
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                />
              )}
              <input
                style={styles.input}
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />

              <div style={styles.passwordWrapper}>
                <input
                  style={styles.input}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  style={styles.showBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div style={styles.options}>
                <label>
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#" style={styles.forgot}>
                  Forgot password?
                </a>
              </div>

              <button style={styles.submit} onClick={handleSubmit}>
                {isLogin ? "Login" : "Sign Up"}
              </button>

              <div style={styles.divider}>or continue with</div>

              <div style={styles.socials}>
                <img src="/google.png" alt="Google" style={styles.socialIcon} />
                <img
                  src="/facebook.png"
                  alt="Facebook"
                  style={styles.socialIcon}
                />
                <img src="/apple.png" alt="Apple" style={styles.socialIcon} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
