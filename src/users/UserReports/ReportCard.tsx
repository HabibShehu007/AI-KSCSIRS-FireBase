import {
  FiShield,
  FiUsers,
  FiMessageSquare,
  FiTruck,
  FiEye,
  FiAlertCircle,
  FiLock,
  FiBriefcase,
  FiMapPin,
  FiClock,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import type { Complaint } from "./UserReports";

type Props = {
  report: Complaint;
  onView: () => void;
};

const icons: Record<string, IconType> = {
  police: FiShield,
  immigration: FiUsers,
  fireservice: FiMessageSquare,
  roadsafety: FiTruck,
  civildefence: FiAlertCircle,
  dss: FiLock,
  efcc: FiBriefcase,
};

export default function ReportCard({ report, onView }: Props) {
  const Icon = report.department
    ? icons[report.department] || FiShield
    : FiShield;

  // ✅ normalize files so it's always an array
  const files = report.files ?? [];

  return (
    <div className="border border-gray-200 rounded-2xl p-6 shadow-md bg-white hover:shadow-xl transition duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
            <Icon className="text-xl" />
          </div>
          <h3 className="font-bold text-[#0a1f44] text-lg">
            {report.subject || "Untitled Complaint"}
          </h3>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            report.status === "Resolved"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {report.status || "Pending"}
        </span>
      </div>

      {/* Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700 mb-3">
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
        <div className="flex items-center gap-2">
          <span className="text-blue-600 font-bold">Dept:</span>
          <span className="capitalize">{report.department || "Unknown"}</span>
        </div>
      </div>

      {/* Message Preview */}
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        {report.message
          ? report.message.length > 100
            ? `${report.message.slice(0, 100)}...`
            : report.message
          : "No description provided"}
      </p>

      {/* Media Preview */}
      {report.voiceNote && (
        <audio
          controls
          src={report.voiceNote}
          className="w-full mb-3 rounded-md"
        />
      )}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {files.map((file, idx) => (
            <img
              key={idx}
              src={file}
              alt={`evidence-${idx}`}
              className="w-24 h-24 object-cover rounded-md border"
            />
          ))}
        </div>
      )}

      {/* Action */}
      <div className="text-right">
        <button
          onClick={onView}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition font-semibold text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FiEye className="text-base" /> View Details
        </button>
      </div>
    </div>
  );
}
