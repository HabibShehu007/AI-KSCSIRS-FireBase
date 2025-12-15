import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiXCircle, FiThumbsUp } from "react-icons/fi";
import { auth } from "../../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

type LogPayload = { email: string };
type LogEntry = { action: "login"; payload: LogPayload; timestamp: string };

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [modal, setModal] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      sessionStorage.setItem("userId", user.uid);
      localStorage.setItem("userInfo", JSON.stringify({ email: user.email }));
      logToAdmin("login", { email: form.email });

      setModal({
        type: "success",
        message: "Login successful! Redirecting to dashboard...",
      });

      // ⏳ Force spinner to stay at least 2s
      setTimeout(() => {
        setLoading(false); // stop spinner
        setModal(null);
        navigate("/user/dashboard");
      }, 2000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setModal({ type: "error", message: errorMessage });

      // ⏳ Also keep spinner for 2s on error
      setTimeout(() => setLoading(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900 px-4 relative">
      {/* 🔙 Back to Signup button */}
      <button
        onClick={() => navigate("/user/auth/signup")}
        className="absolute top-6 left-6 flex items-center gap-2 text-white hover:text-gray-200 transition"
      >
        <FiArrowLeft className="text-lg" /> Back to Sign Up
      </button>

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
            disabled={loading}
            className={`w-full py-2 rounded-md text-white font-semibold transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-800"
            }`}
          >
            {loading ? (
              <motion.div
                className="flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Logging in...
              </motion.div>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </motion.div>

      {/* 🔔 Animated Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: -30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 30 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
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
                  <FiXCircle className="text-6xl animate-bounce" />
                ) : (
                  <FiThumbsUp className="text-6xl animate-bounce" />
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
      </AnimatePresence>
    </div>
  );
}
