import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Complaint } from "./types";
import {
  FiUser,
  FiMail,
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiSearch,
  FiFileText,
  FiMic,
  FiMessageSquare,
  FiAlertCircle,
} from "react-icons/fi";

export default function PoliceComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [reply, setReply] = useState("");
  const [isResolved, setIsResolved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("complaints-police");
    const list = stored ? (JSON.parse(stored) as Complaint[]) : [];
    const found = list.find((c) => c.id === Number(id));
    setComplaint(found || null);
  }, [id]);

  const updateComplaint = (updates: Partial<Complaint>) => {
    if (!complaint) return;
    const updated: Complaint = { ...complaint, ...updates };
    const stored = localStorage.getItem("complaints-police");
    const list = stored ? (JSON.parse(stored) as Complaint[]) : [];
    const newList = list.map((c) => (c.id === updated.id ? updated : c));
    localStorage.setItem("complaints-police", JSON.stringify(newList));
    setComplaint(updated);
  };

  const handleReply = () => {
    updateComplaint({ reply, status: "Resolved" });
    setIsResolved(true);
    setTimeout(() => navigate("/admin/police/inbox"), 1500);
  };

  const handleStatusChange = (status: Complaint["status"]) => {
    updateComplaint({ status });
  };

  if (!complaint) {
    return (
      <div className="text-gray-600 text-center py-12 text-lg font-semibold">
        Complaint not found.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <h2 className="text-4xl font-extrabold text-[#0a1f44] tracking-tight flex items-center gap-3">
        <FiAlertCircle className="text-red-600 text-3xl animate-bounce" />
        Police Complaint Details
      </h2>

      {/* Two-column layout */}
      <div className="bg-white p-8 rounded-2xl shadow-xl grid md:grid-cols-2 gap-8">
        {/* Left Side: Message */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-2 text-[#0a1f44]">
            <FiMessageSquare className="text-blue-600" /> Message
          </h3>
          <p className="text-gray-800 text-lg font-medium bg-gray-50 p-4 rounded-lg shadow-inner">
            {complaint.message}
          </p>

          <div>
            <span className="font-bold">Subject:</span>{" "}
            <span className="font-semibold">{complaint.subject}</span>
          </div>

          {/* Reply Box */}
          <div className="mt-6">
            <label className="font-bold mb-2 text-[#0a1f44] text-lg flex items-center gap-2">
              <FiMessageSquare /> Reply
            </label>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={4}
              className="w-full border rounded-lg p-3 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your response here..."
            />
          </div>

          <button
            onClick={handleReply}
            className="bg-blue-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-800 transition transform hover:scale-105 mt-4 shadow-md"
          >
            Send Reply & Mark as Resolved
          </button>

          {isResolved && (
            <p className="text-green-600 font-bold mt-4 animate-pulse text-lg">
              Complaint marked as resolved. Redirecting to inbox...
            </p>
          )}
        </div>

        {/* Right Side: Info */}
        <div className="space-y-6 text-gray-800 text-lg">
          <h3 className="text-2xl font-bold flex items-center gap-2 text-[#0a1f44]">
            <FiFileText className="text-blue-600" /> Complaint Info
          </h3>

          <p className="flex items-center gap-2">
            <FiUser className="text-blue-700 text-xl" />
            <span className="font-bold">User:</span>{" "}
            <span className="font-semibold">{complaint.user}</span> (
            {complaint.phone})
          </p>
          <p className="flex items-center gap-2">
            <FiMail className="text-yellow-600 text-xl" />
            <span className="font-bold">Email:</span>{" "}
            <span className="font-semibold">{complaint.email}</span>
          </p>
          <p className="flex items-center gap-2">
            <FiMapPin className="text-red-600 text-xl" />
            <span className="font-bold">Address:</span>{" "}
            <span className="font-semibold">{complaint.address}</span>
          </p>
          <p className="flex items-center gap-2">
            <FiClock className="text-gray-600 text-xl" />
            <span className="font-bold">Received:</span>{" "}
            <span className="font-semibold">
              {new Date(complaint.timestamp).toLocaleString()}
            </span>
          </p>

          <p>
            <span className="font-bold">Status:</span>{" "}
            <span
              className={`px-3 py-1 rounded-full text-white text-sm font-bold uppercase tracking-wide ${
                complaint.status === "Resolved"
                  ? "bg-green-600 animate-pulse"
                  : complaint.status === "Investigating"
                  ? "bg-blue-600"
                  : "bg-yellow-500"
              }`}
            >
              {complaint.status}
            </span>
          </p>

          {/* Voice Note */}
          {complaint.voiceNote && (
            <div>
              <span className="font-bold flex items-center gap-2 text-[#0a1f44]">
                <FiMic /> Voice Note:
              </span>
              <audio
                controls
                src={complaint.voiceNote}
                className="mt-2 w-full rounded border"
              />
            </div>
          )}

          {/* Files */}
          {complaint.files.length > 0 && (
            <div>
              <span className="font-bold flex items-center gap-2 text-[#0a1f44]">
                <FiFileText /> Files:
              </span>
              <ul className="list-disc ml-6 text-blue-700 font-semibold">
                {complaint.files.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Status Buttons */}
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={() => handleStatusChange("Pending")}
              className="flex items-center gap-2 px-5 py-2 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600 transition transform hover:scale-105"
            >
              <FiClock className="text-lg" /> Pending
            </button>
            <button
              onClick={() => handleStatusChange("Investigating")}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition transform hover:scale-105"
            >
              <FiSearch className="text-lg" /> Investigating
            </button>
            <button
              onClick={() => handleStatusChange("Resolved")}
              className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition transform hover:scale-105"
            >
              <FiCheckCircle className="text-lg" /> Resolved
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
