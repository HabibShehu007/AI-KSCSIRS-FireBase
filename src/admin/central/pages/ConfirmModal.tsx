import { FiAlertTriangle } from "react-icons/fi";

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-96 text-center">
        <FiAlertTriangle className="text-red-600 text-4xl mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[#0a1f44] mb-4">
          Confirm Action
        </h2>
        <p className="text-lg text-gray-700 mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
