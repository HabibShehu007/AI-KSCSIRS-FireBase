// src/admin/departments/police/NewMessageOverlay.tsx
import { FiAlertCircle } from "react-icons/fi";

export default function NewMessageOverlay({
  onEngage,
}: {
  onEngage: () => void;
}) {
  console.log("🚨 NewMessageOverlay rendered"); // Debug log

  return (
    <div
      className="absolute inset-0 bg-red-700 bg-opacity-90 flex items-center justify-center z-50"
      role="alert"
      aria-live="assertive"
    >
      <div className="text-center text-white">
        {/* Icon with bounce animation */}
        <FiAlertCircle className="mx-auto text-6xl mb-4 animate-bounce" />

        {/* Title with pulse effect */}
        <h2 className="text-3xl font-extrabold mb-2 animate-pulse">
          New Message Received
        </h2>

        <p className="mb-6 text-lg font-medium">
          Click engage to view the message
        </p>

        {/* Engage button with hover scale */}
        <button
          onClick={() => {
            console.log("👆 Engage button clicked"); // Debug log
            onEngage();
          }}
          className="px-6 py-2 bg-white text-red-700 font-semibold rounded shadow-lg hover:bg-gray-200 transform hover:scale-105 transition duration-300"
        >
          Engage
        </button>
      </div>
    </div>
  );
}
