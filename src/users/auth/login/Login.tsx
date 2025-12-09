import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";

// Firebase imports
import { auth } from "../../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

type LogPayload = {
  email: string;
};

type LogEntry = {
  action: "login";
  payload: LogPayload;
  timestamp: string;
};

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [modal, setModal] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const logToAdmin = (action: "login", payload: LogPayload) => {
    const logs: LogEntry[] = JSON.parse(
      localStorage.getItem("adminLogs") || "[]"
    );
    logs.push({ action, payload, timestamp: new Date().toISOString() });
    localStorage.setItem("adminLogs", JSON.stringify(logs));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // ✅ Firebase login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      // ✅ Store UID for dashboard greeting
      sessionStorage.setItem("userId", user.uid);

      // ✅ Optional: store user email
      localStorage.setItem("userInfo", JSON.stringify({ email: user.email }));

      logToAdmin("login", { email: form.email });

      setModal({
        type: "success",
        message: "Login successful! Redirecting to dashboard...",
      });

      setTimeout(() => {
        setModal(null);
        navigate("/user/dashboard");
      }, 2000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Login failed. Please try again.";

      setModal({
        type: "error",
        message: errorMessage,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-[#0a1f44] mb-2">
          Welcome Back
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Login to continue
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="w-full py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/admin/login")}
            className="text-sm text-blue-700 underline hover:text-blue-900"
          >
            Go to Admin Portal
          </button>
        </div>
      </motion.div>

      {/* 🔔 Modal for success or error */}
      {modal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full text-center border ${
              modal.type === "error" ? "border-red-200" : "border-green-200"
            }`}
          >
            <div
              className={`flex justify-center mb-3 ${
                modal.type === "error" ? "text-red-600" : "text-green-600"
              }`}
            >
              {modal.type === "error" ? (
                <FiAlertCircle className="text-5xl" />
              ) : (
                <FiCheckCircle className="text-5xl" />
              )}
            </div>
            <h3
              className={`text-xl font-bold mb-2 ${
                modal.type === "error" ? "text-red-600" : "text-green-600"
              }`}
            >
              {modal.type === "error" ? "Login Failed" : "Login Successful"}
            </h3>
            <p className="text-gray-700 mb-4">{modal.message}</p>
            {modal.type === "error" && (
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
