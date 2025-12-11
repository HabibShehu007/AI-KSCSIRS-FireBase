import { FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "success" | "error";
};

export default function Modal({
  isOpen,
  onClose,
  title,
  message,
  type = "success",
}: ModalProps) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const isSuccess = type === "success";

  const handleClose = () => {
    onClose();
    if (isSuccess) {
      navigate("/user/dashboard"); // ✅ correct path
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fadeIn">
      <div
        className={`bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full text-center border transform animate-zoomIn ${
          isSuccess ? "border-green-300" : "border-red-300"
        }`}
      >
        <div className="flex justify-center mb-4">
          {isSuccess ? (
            <FiCheckCircle className="text-green-500 text-6xl animate-pulse" />
          ) : (
            <FiAlertTriangle className="text-red-500 text-6xl animate-pulse" />
          )}
        </div>
        <h2
          id="modal-title"
          className={`text-2xl font-extrabold mb-3 tracking-wide ${
            isSuccess ? "text-[#0a1f44]" : "text-red-700"
          }`}
        >
          {title}
        </h2>
        <p
          id="modal-message"
          className="text-base text-gray-700 font-medium leading-relaxed mb-6"
        >
          {message}
        </p>
        <button
          onClick={handleClose}
          className={`px-6 py-2.5 rounded-full transition-all duration-200 font-bold text-sm shadow-md focus:outline-none focus:ring-2 animate-bounce ${
            isSuccess
              ? "bg-green-600 text-white hover:bg-green-700 focus:ring-green-400"
              : "bg-red-600 text-white hover:bg-red-700 focus:ring-red-400"
          }`}
        >
          Close
        </button>
      </div>
    </div>
  );
}
