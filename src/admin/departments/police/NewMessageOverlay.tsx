// src/admin/departments/police/NewMessageOverlay.tsx
import { FiAlertCircle, FiX } from "react-icons/fi";

type Props = {
  onEngage: () => void;
  onDismiss?: () => void;
  title?: string;
  description?: string;
};

export default function NewMessageOverlay({
  onEngage,
  onDismiss,
  title = "New Message Received",
  description = "Click engage to view the message",
}: Props) {
  console.log("🚨 NewMessageOverlay rendered");

  return (
    <div
      className="absolute inset-0 bg-red-700 bg-opacity-90 flex items-center justify-center z-50 animate-fadeIn"
      role="alert"
      aria-live="assertive"
    >
      <div className="text-center text-white relative">
        {/* Close button */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Dismiss alert"
            className="absolute top-2 right-2 text-white hover:text-gray-200"
          >
            <FiX className="text-2xl" />
          </button>
        )}

        {/* Icon */}
        <FiAlertCircle className="mx-auto text-6xl mb-4 animate-bounce" />

        {/* Title */}
        <h2 className="text-3xl font-extrabold mb-2 animate-pulse">{title}</h2>

        {/* Description */}
        <p className="mb-6 text-lg font-medium">{description}</p>

        {/* Engage button */}
        <button
          onClick={onEngage}
          className="px-6 py-2 bg-white text-red-700 font-semibold rounded shadow-lg hover:bg-gray-200 transform hover:scale-105 transition duration-300"
        >
          Engage
        </button>
      </div>
    </div>
  );
}
