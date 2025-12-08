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
  const progress = (step - 1) * 50;

  const getGradient = () => {
    if (progress < 40) return "from-red-500 via-red-400 to-red-300";
    if (progress < 80) return "from-yellow-400 via-yellow-300 to-yellow-200";
    return "from-green-500 via-green-400 to-green-300";
  };

  return (
    <div className="w-full mb-8">
      {/* Step Circles + Labels */}
      <div className="flex justify-between items-center mb-6 px-1 relative">
        {steps.map((s, index) => {
          const stepNumber = index + 1;
          const isActive = step === stepNumber;
          const isCompleted = step > stepNumber;
          const Icon = s.icon;

          return (
            <div
              key={s.label}
              className="flex flex-col items-center text-xs font-medium w-1/3 group"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 shadow-md ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isActive
                    ? "bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {isCompleted ? "✓" : <Icon />}
              </div>
              <span
                className={`mt-1 ${
                  isActive ? "text-blue-700 font-semibold" : "text-gray-500"
                }`}
              >
                {s.label}
              </span>

              {/* Animated Underline */}
              {isActive && (
                <motion.div
                  layoutId="underline"
                  className="absolute -bottom-2.5 w-10 h-1 bg-blue-700 rounded-full"
                  initial={false}
                  animate={{
                    left: `calc(${(index / (steps.length - 1)) * 100}% - 20px)`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Upgraded Progress Bar */}
      <div className="relative w-full h-6 bg-gray-200 rounded-full shadow-inner overflow-hidden">
        {/* Animated Gradient Fill */}
        <motion.div
          className={`absolute top-0 left-0 h-full bg-linear-to-r ${getGradient()} animate-pulse rounded-full`}
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        {/* Glowing Dot with Bounce + Number */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-white border-2 border-gray-400 rounded-full shadow-lg flex items-center justify-center text-sm font-bold text-gray-700"
          initial={{ scale: 1 }}
          animate={{
            left: `calc(${progress}% - 20px)`,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          {progress === 0 ? "0%" : `${Math.round(progress)}%`}
        </motion.div>
      </div>
    </div>
  );
}
