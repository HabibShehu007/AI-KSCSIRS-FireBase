// src/admin/departments/dss/NewMessageOverlay.tsx
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
        <FiAlertCircle className="mx-auto text-6xl mb-4" />
        <h2 className="text-2xl font-bold mb-2">New Message Received</h2>
        <p className="mb-6">Click engage to view the message</p>
        <button
          onClick={() => {
            console.log("👆 Engage button clicked"); // Debug log
            onEngage();
          }}
          className="px-6 py-2 bg-white text-red-700 font-semibold rounded hover:bg-gray-200"
        >
          Engage
        </button>
      </div>
    </div>
  );
}
