// src/admin/auth/central/CentralLogin.tsx
import { useState } from "react";
import CentralLoginForm from "./CentralLoginForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CentralLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/admin/login", {
        email,
        password,
        role: "central", // ✅ distinguish central admin
      });

      // Save token or session
      localStorage.setItem("adminToken", res.data.token);

      // Redirect to central dashboard
      navigate("/admin/central/dashboard");
    } catch (err: unknown) {
      console.error("❌ Login failed:", err);
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ?? "Invalid credentials or server error"
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid credentials or server error");
      }
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
