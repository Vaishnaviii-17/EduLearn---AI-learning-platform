"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchData } from "@/utils/api";

export default function AvatarSelection() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [users, setUsers] = useState([]);
  const avatars = [
    "/avatar/avatar1.png",
    "/avatar/avatar2.png",
    "/avatar/avatar3.png",
    "/avatar/avatar4.png",
  ];

  // ✅ Fetch user data once when page loads
  useEffect(() => {
    async function getUsers() {
      try {
        const data = await fetchData("api/users");
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    }
    getUsers();
  }, []);

  const handleSave = () => {
    if (!selected) {
      alert("Please select an avatar!");
      return;
    }
    localStorage.setItem("userAvatar", selected);
    router.push("/dashboard");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Choose Your Avatar</h1>
      <p style={styles.subtitle}>Select an avatar to represent your profile</p>

      <div style={styles.avatarGrid}>
        {avatars.map((avatar, index) => (
          <img
            key={index}
            src={avatar}
            alt={`Avatar ${index + 1}`}
            onClick={() => setSelected(avatar)}
            style={{
              ...styles.avatar,
              border:
                selected === avatar
                  ? "4px solid #3b82f6"
                  : "2px solid transparent",
            }}
          />
        ))}
      </div>

      <button style={styles.saveBtn} onClick={handleSave}>
        Save & Continue
      </button>
    </div>
  );
}


const styles = {
  container: {
    textAlign: "center",
    padding: "60px 20px",
    fontFamily: "Poppins, sans-serif",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#1e293b",
  },
  subtitle: {
    color: "#475569",
    marginBottom: "40px",
  },
  avatarGrid: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "25px",
    marginBottom: "50px",
  },
  avatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    cursor: "pointer",
    objectFit: "cover",
    transition: "0.3s",
  },
  saveBtn: {
    background: "linear-gradient(90deg, #2563eb, #1e40af)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "12px 30px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
  },
};
