import { FiCheckCircle } from "react-icons/fi";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
};

export default function Modal({ isOpen, onClose, title, message }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-message"
    >
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full text-center border border-blue-200">
        <div className="flex justify-center mb-4">
          <FiCheckCircle className="text-green-600 text-5xl animate-bounce" />
        </div>
        <h2
          id="modal-title"
          className="text-2xl font-extrabold text-[#0a1f44] mb-3 tracking-wide"
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
          onClick={onClose}
          className="bg-blue-700 text-white px-6 py-2.5 rounded-full hover:bg-blue-800 transition font-bold text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Close
        </button>
      </div>
    </div>
  );
}
