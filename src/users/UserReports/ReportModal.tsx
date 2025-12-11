import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiMic,
  FiFileText,
} from "react-icons/fi";
import type { Complaint } from "./UserReports";

type Props = {
  report: Complaint | null;
  onClose: () => void;
};

export default function ReportModal({ report, onClose }: Props) {
  if (!report) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white p-8 rounded-2xl max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh] border border-blue-200">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-extrabold text-[#0a1f44] tracking-wide mb-1">
            {report.subject || "Untitled Complaint"}
          </h3>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Department:</span>{" "}
            <span className="capitalize">{report.department || "Unknown"}</span>{" "}
            |{" "}
            <span
              className={`font-semibold px-2 py-1 rounded-full ${
                report.status === "Resolved"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {report.status || "Pending"}
            </span>
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
          <div className="flex items-center gap-2">
            <FiUser className="text-blue-600" />
            <span>
              <strong>Reported By:</strong> {report.userName || "Anonymous"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FiMail className="text-blue-600" />
            <span>
              <strong>Email:</strong> {report.userEmail || "Not provided"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FiPhone className="text-blue-600" />
            <span>
              <strong>Phone:</strong> {report.userPhone || "Not provided"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FiMapPin className="text-blue-600" />
            <span>
              <strong>Location:</strong> {report.address || "Not provided"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock className="text-blue-600" />
            <span>
              <strong>Submitted:</strong>{" "}
              {report.createdAt
                ? new Date(report.createdAt).toLocaleString()
                : "Unknown"}
            </span>
          </div>
        </div>

        {/* Message */}
        <div className="mb-6">
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line border-l-4 border-blue-600 pl-4">
            {report.message || "No description provided"}
          </p>
        </div>

        {/* Files */}
        {report.files && report.files.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
              <FiFileText className="text-blue-600" />
              <span>Attached Files:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {report.files.map((file, i) => (
                <img
                  key={i}
                  src={file}
                  alt={`evidence-${i}`}
                  className="w-24 h-24 object-cover rounded-md border"
                />
              ))}
            </div>
          </div>
        )}

        {/* Voice Note */}
        {report.voiceNote && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
              <FiMic className="text-blue-600" />
              <span>Voice Note:</span>
            </div>
            <audio controls src={report.voiceNote} className="w-full" />
          </div>
        )}

        {/* Close Button */}
        <div className="text-right">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#0a1f44] text-white rounded-full hover:bg-blue-800 transition font-bold text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
