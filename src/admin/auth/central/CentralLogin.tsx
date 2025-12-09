// src/admin/auth/central/CentralLogin.tsx
import { useState } from "react";
import CentralLoginForm from "./CentralLoginForm";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase"; // ✅ your Firebase config
import { collection, query, where, getDocs } from "firebase/firestore";

export default function CentralLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ Query Firestore for central admin
      const q = query(
        collection(db, "central_admins"),
        where("email", "==", email),
        where("password", "==", password)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        console.log("✅ Central Admin found:", snapshot.docs[0].data());

        // Save session marker (no token since we’re not using Auth)
        localStorage.setItem("adminSession", "central");

        // Redirect to central dashboard
        navigate("/admin/central/dashboard");
      } else {
        setError("❌ Record not found. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("⚠️ Something went wrong. Try again.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6 max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center text-[#0a1f44]">
        Central Admin Login
      </h2>

      <CentralLoginForm
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full py-2 bg-[#0a1f44] text-white rounded-md hover:bg-blue-800 transition font-semibold"
      >
        Login
      </button>
    </form>
  );
}
