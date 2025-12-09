import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import ProgressBar from "./ProgressBar";
import StepPersonalInfo from "./StepPersonalInfo";
import StepContactInfo from "./StepContactInfo";
import StepSecurity from "./StepSecurity";

// Firebase imports
import { auth, db } from "../../../firebase"; // your firebase.ts config
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

    try {
      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      // 2. Save extra info in Firestore
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

      // 3. Success flow
      setShowSuccess(true);
      setTimeout(() => navigate("/user/auth/login"), 3000);
    } catch (err: Error | unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Signup failed. Please try again.";
      setModal({
        type: "error",
        message: errorMessage,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-900 via-blue-800 to-blue-700 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] w-full max-w-lg relative"
      >
        <h2 className="text-3xl font-extrabold text-center text-blue-900 mb-2 tracking-tight">
          Create Your Account
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Step {step} of 3 — Let’s get you started
        </p>

        <ProgressBar step={step} />
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
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

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`px-6 py-2 rounded-md font-semibold transition-all duration-300 ${
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
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Submit
              </button>
            )}
          </div>
        </form>
        {/* Success Modal */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-white"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center border border-green-200"
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.4, 1], rotate: [0, 15, -15, 0] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                  }}
                  className="text-green-600"
                >
                  <FiCheckCircle className="text-6xl" />
                </motion.div>
              </div>
              <h2 className="text-3xl font-black text-[#0a1f44] mb-2 tracking-tight">
                SIGNUP SUCCESSFUL
              </h2>
              <p className="text-base text-gray-700 mb-4 font-medium">
                Redirecting to login...
              </p>
              <div className="text-sm text-gray-500 font-semibold">
                Welcome to the civic network 💙
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Error/Info Modal */}
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
              className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full text-center border border-red-200"
            >
              <h3
                className={`text-xl font-bold mb-2 ${
                  modal.type === "error" ? "text-red-600" : "text-blue-600"
                }`}
              >
                {modal.type === "error" ? "Error" : "Notice"}
              </h3>
              <p className="text-gray-700 mb-4">{modal.message}</p>
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
