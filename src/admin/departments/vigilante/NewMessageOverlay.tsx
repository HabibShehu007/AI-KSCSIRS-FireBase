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
      className="fixed inset-0 bg-red-700 bg-opacity-90 flex items-center justify-center z-50 animate-fadeIn px-4"
      role="alert"
      aria-live="assertive"
    >
      <div className="w-full max-w-md sm:max-w-lg text-center text-white relative p-6 sm:p-8 rounded-lg">
        {/* Close button */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Dismiss alert"
            className="absolute top-3 right-3 text-white hover:text-gray-200"
          >
            <FiX className="text-2xl sm:text-3xl" />
          </button>
        )}

        {/* Icon */}
        <FiAlertCircle className="mx-auto text-5xl sm:text-6xl mb-4 animate-bounce" />

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 animate-pulse">
          {title}
        </h2>

        {/* Description */}
        <p className="mb-6 text-base sm:text-lg font-medium">{description}</p>

        {/* Engage button */}
        <button
          onClick={onEngage}
          className="w-full sm:w-auto px-6 py-3 bg-white text-red-700 font-semibold rounded shadow-lg hover:bg-gray-200 transform hover:scale-105 transition duration-300"
        >
          Engage
        </button>
      </div>
    </div>
  );
}
