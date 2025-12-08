import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiLoader, FiAlertCircle } from "react-icons/fi";

type Props = {
  nin: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValidated: () => void;
  isValidated: boolean;
};

export default function NINValidator({
  nin,
  onChange,
  onValidated,
  isValidated,
}: Props) {
  const [loading, setLoading] = useState(false);

  const isValidNIN = /^\d{11}$/.test(nin); // ✅ Only 11 digits

  const handleValidate = useCallback(() => {
    if (!isValidNIN || loading || isValidated) {
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onValidated();
    }, 2000);
  }, [isValidNIN, loading, isValidated, onValidated]);

  useEffect(() => {
    if (nin.length === 11 && isValidNIN && !isValidated && !loading) {
      handleValidate();
    }
  }, [nin, isValidNIN, isValidated, loading, handleValidate]);

  return (
    <div className="space-y-2">
      <label htmlFor="nin" className="text-sm font-medium text-gray-700">
        National Identification Number (NIN)
      </label>
      <div className="flex gap-2 items-center">
        <input
          id="nin"
          name="nin"
          type="text"
          value={nin}
          onChange={onChange}
          placeholder="Enter your NIN"
          className={`w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
            isValidNIN || nin.length === 0
              ? "border-gray-300 focus:ring-blue-500"
              : "border-red-500 focus:ring-red-500"
          }`}
          maxLength={11}
          inputMode="numeric"
          pattern="\d*"
        />
        <button
          type="button"
          onClick={handleValidate}
          disabled={loading || isValidated || !isValidNIN}
          className={`px-4 py-2 rounded-md font-semibold transition flex items-center justify-center gap-2 ${
            isValidated
              ? "bg-green-600 text-white"
              : "bg-blue-700 text-white hover:bg-blue-800"
          }`}
        >
          {loading ? (
            <FiLoader className="animate-spin text-xl" />
          ) : isValidated ? (
            "Validated"
          ) : (
            "Validate"
          )}
        </button>
      </div>

      {/* Error Message */}
      {!isValidNIN && nin.length > 0 && (
        <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
          <FiAlertCircle /> NIN must be 11 digits only.
        </div>
      )}

      {/* Success Message */}
      {!loading && isValidated && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 text-green-700 text-sm font-medium"
        >
          <FiCheckCircle /> This NIN has been validated successfully.
        </motion.div>
      )}
    </div>
  );
}
