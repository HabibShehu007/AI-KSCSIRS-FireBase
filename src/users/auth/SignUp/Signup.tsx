import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiThumbsUp, FiXCircle } from "react-icons/fi";
import ProgressBar from "./ProgressBar";
import StepPersonalInfo from "./StepPersonalInfo";
import StepContactInfo from "./StepContactInfo";
import StepSecurity from "./StepSecurity";

// Firebase imports
import { auth, db } from "../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nin: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    state: "",
    lga: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [isNINValidated, setIsNINValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [modal, setModal] = useState<{
    type: "error" | "info";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const isStepValid = () => {
    if (step === 1)
      return isNINValidated && form.name && form.phone && form.email;
    if (step === 2) return form.address && form.state && form.lga;
    if (step === 3) return form.password && form.confirmPassword && form.terms;
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return setModal({ type: "error", message: "Passwords do not match" });
    }
    if (!form.terms) {
      return setModal({ type: "error", message: "You must accept the terms" });
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        nin: form.nin,
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        state: form.state,
        lga: form.lga,
        termsAccepted: form.terms,
        createdAt: new Date().toISOString(),
      });

      setShowSuccess(true);
      setTimeout(() => navigate("/user/auth/login"), 2000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Signup failed. Please try again.";
      setModal({ type: "error", message: errorMessage });
    } finally {
      // ⏳ keep spinner visible at least 2s
      setTimeout(() => setLoading(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-900 via-blue-800 to-blue-700 px-3 py-6 relative">
      {/* 🔙 Back to Home link (outside container, top-left) */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-3 font-bold left-3 text-white text-sm hover:text-gray-200 transition"
      >
        ← Home
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative"
      >
        <h2 className="text-xl font-bold text-center text-blue-900 mb-4">
          Create Your Account
        </h2>

        {/* Progress bar only, removed distracting step text */}
        <ProgressBar step={step} />

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {step === 1 && (
            <StepPersonalInfo
              form={form}
              handleChange={handleChange}
              isValidated={isNINValidated}
              onValidated={() => setIsNINValidated(true)}
            />
          )}
          {step === 2 && (
            <StepContactInfo form={form} handleChange={handleChange} />
          )}
          {step === 3 && (
            <StepSecurity form={form} handleChange={handleChange} />
          )}

          <div className="flex justify-between pt-2">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`px-5 py-2 rounded-md text-sm font-semibold transition ${
                  isStepValid()
                    ? "bg-blue-700 text-white hover:bg-blue-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className={`px-5 py-2 rounded-md text-sm font-semibold w-full ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed text-white"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {loading ? (
                  <motion.div
                    className="flex items-center justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing up...
                  </motion.div>
                ) : (
                  "Submit"
                )}
              </button>
            )}
          </div>
        </form>

        {/* 🔗 Login links (bottom-right inside container) */}
        <div className="mt-4 text-right space-x-3">
          <button
            onClick={() => navigate("/user/auth/login")}
            className="text-xs font-bold text-blue-700 underline hover:text-blue-900"
          >
            User Login
          </button>
        </div>

        {/* ✅ Success Modal */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center border border-green-200"
              >
                <div className="flex justify-center mb-4 text-green-600">
                  <FiThumbsUp className="text-6xl animate-bounce" />
                </div>
                <h2 className="text-2xl font-bold text-[#0a1f44] mb-2">
                  Signup Successful
                </h2>
                <p className="text-gray-700 mb-4">Redirecting to login...</p>
                <div className="text-sm text-gray-500 font-semibold">
                  Welcome to the civic network 💙
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ❌ Error Modal */}
        <AnimatePresence>
          {modal && (
            <motion.div
              className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full text-center border border-red-200"
              >
                <div className="flex justify-center mb-3 text-red-600">
                  <FiXCircle className="text-6xl animate-pulse" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-red-600">Error</h3>
                <p className="text-gray-700 mb-4">{modal.message}</p>
                <button
                  onClick={() => setModal(null)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
