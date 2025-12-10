import { motion } from "framer-motion";
import { FiUser, FiMapPin, FiLock } from "react-icons/fi";

type ProgressBarProps = {
  step: number; // 1 to 3
};

const steps = [
  { label: "Personal", icon: FiUser },
  { label: "Contact", icon: FiMapPin },
  { label: "Security", icon: FiLock },
];

export default function ProgressBar({ step }: ProgressBarProps) {
  const progress = (step / steps.length) * 100;

  return (
    <div className="w-full mb-8">
      {/* Step Circles + Labels */}
      <div className="flex justify-between items-center mb-6 px-2">
        {steps.map((s, index) => {
          const stepNumber = index + 1;
          const isActive = step === stepNumber;
          const isCompleted = step > stepNumber;
          const Icon = s.icon;

          return (
            <div
              key={s.label}
              className="flex flex-col items-center text-xs font-medium w-1/3"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-md ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {isCompleted ? "✓" : <Icon />}
              </motion.div>
              <span
                className={`mt-2 ${
                  isActive ? "text-blue-600 font-semibold" : "text-gray-500"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Straightforward Progress Bar */}
      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-blue-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
