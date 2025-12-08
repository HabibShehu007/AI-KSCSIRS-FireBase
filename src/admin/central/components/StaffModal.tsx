import { FiX } from "react-icons/fi";

interface StaffModalProps {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
}

export default function StaffModal({
  title,
  children,
  onClose,
}: StaffModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition"
        >
          <FiX className="text-2xl" />
        </button>

        {/* Header */}
        {title && (
          <div className="border-b px-6 py-4">
            <h2 className="text-xl font-bold text-[#0a1f44]">{title}</h2>
          </div>
        )}

        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
