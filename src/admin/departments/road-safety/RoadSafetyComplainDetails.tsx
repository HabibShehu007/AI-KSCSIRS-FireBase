// src/admin/departments/road/roadComplaintDetails.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Complaint } from "../../../users/message/firebaseStorage";
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
import { db } from "../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function RoadSafetyComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [reply, setReply] = useState("");
  const [isResolved, setIsResolved] = useState(false);

  // ✅ Fetch complaint
  useEffect(() => {
    if (!id) return;
    const fetchComplaint = async () => {
      const ref = doc(db, "complaints", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setComplaint({
          id: snap.id,
          user: data.userName || data.user || "Unknown",
          email: data.userEmail || data.email || "",
          phone: data.userPhone || data.phone || "",
          subject: data.subject,
          message: data.message,
          address: data.address,
          timestamp: data.timestamp || data.createdAt,
          status: data.status,
          department: data.department,
          files: data.files || [],
          voiceNote: data.voiceNote,
          reply: data.reply,
        } as Complaint);
      } else {
        setComplaint(null);
      }
    };
    fetchComplaint();
  }, [id]);

  // ✅ Update complaint
  const updateComplaint = async (updates: Partial<Complaint>) => {
    if (!complaint || !id) return;
    const ref = doc(db, "complaints", id);
    await updateDoc(ref, updates);
    setComplaint({ ...complaint, ...updates });
  };

  const handleReply = async () => {
    await updateComplaint({ reply, status: "Resolved" });
    setIsResolved(true);
    setTimeout(() => navigate("/admin/roadsafety/inbox"), 1500);
  };

  const handleStatusChange = async (status: Complaint["status"]) => {
    await updateComplaint({ status });
  };

  if (!complaint) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-600">
        <FiAlertCircle className="text-5xl text-red-500 mb-4" />
        <p className="text-lg font-semibold">Complaint not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a1f44] tracking-tight flex items-center gap-3">
        <FiAlertCircle className="text-red-600 text-2xl sm:text-3xl animate-bounce" />
        Complaint Details
      </h2>

      {/* Layout */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Message + Reply */}
        <div className="space-y-6">
          <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-[#0a1f44]">
            <FiMessageSquare className="text-blue-600" /> Message
          </h3>
          <p className="text-gray-800 text-base sm:text-lg font-medium bg-gray-50 p-4 rounded-lg shadow-inner leading-relaxed">
            {complaint.message || "No message provided."}
          </p>

          <p className="text-sm text-gray-600">
            <span className="font-bold">Subject:</span>{" "}
            {complaint.subject || "No subject"}
          </p>

          {/* Reply */}
          <div className="mt-6 space-y-4">
            <label className="font-bold text-[#0a1f44] text-lg flex items-center gap-2">
              <FiMessageSquare /> Reply
            </label>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={4}
              className="w-full border rounded-lg p-3 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Type your response here..."
            />
            <button
              onClick={handleReply}
              className="w-full sm:w-auto bg-blue-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-800 transition transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
            >
              <FiCheckCircle /> Send Reply & Resolve
            </button>
            {isResolved && (
              <p className="text-green-600 font-bold animate-pulse text-base sm:text-lg">
                Complaint marked as resolved. Redirecting...
              </p>
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div className="space-y-6 text-gray-800 text-base sm:text-lg">
          <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-[#0a1f44]">
            <FiFileText className="text-blue-600" /> Complaint Info
          </h3>

          <p className="flex items-center gap-2">
            <FiUser className="text-blue-700" />
            <span className="font-bold">User:</span>{" "}
            {complaint.user || "Unknown"} ({complaint.phone || "N/A"})
          </p>
          <p className="flex items-center gap-2">
            <FiMail className="text-yellow-600" />
            <span className="font-bold">Email:</span>{" "}
            {complaint.email || "No Email"}
          </p>
          <p className="flex items-center gap-2">
            <FiMapPin className="text-red-600" />
            <span className="font-bold">Address:</span>{" "}
            {complaint.address || "No Address"}
          </p>
          <p className="flex items-center gap-2">
            <FiClock className="text-gray-600" />
            <span className="font-bold">Received:</span>{" "}
            {complaint.timestamp
              ? typeof complaint.timestamp === "object" &&
                "toDate" in complaint.timestamp
                ? complaint.timestamp.toDate().toLocaleString()
                : new Date(Number(complaint.timestamp)).toLocaleString()
              : "N/A"}
          </p>

          {/* Status */}
          <p className="flex items-center gap-2">
            <span className="font-bold">Status:</span>
            <span
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-white text-xs sm:text-sm font-bold uppercase tracking-wide ${
                complaint.status === "Resolved"
                  ? "bg-green-600 animate-pulse"
                  : complaint.status === "Investigating"
                  ? "bg-blue-600"
                  : "bg-yellow-500"
              }`}
            >
              {complaint.status === "Resolved" && <FiCheckCircle />}
              {complaint.status === "Investigating" && <FiSearch />}
              {complaint.status === "Pending" && <FiAlertCircle />}
              {complaint.status}
            </span>
          </p>

          {/* Voice Note */}
          {complaint.voiceNote && (
            <div>
              <span className="font-bold flex items-center gap-2 text-[#0a1f44]">
                <FiMic /> Voice Note
              </span>
              <audio
                controls
                src={complaint.voiceNote}
                className="mt-2 w-full rounded border"
              />
            </div>
          )}

          {/* Files */}
          {complaint.files && complaint.files.length > 0 && (
            <div>
              <span className="font-bold flex items-center gap-2 text-[#0a1f44]">
                <FiFileText /> Files
              </span>
              <ul className="list-disc ml-6 text-blue-700 font-semibold space-y-1">
                {complaint.files.map((f, i) => (
                  <li key={i}>
                    <a
                      href={f}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline wrap-break-words"
                    >
                      {f}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Status Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-6">
            <button
              onClick={() => handleStatusChange("Pending")}
              className="flex items-center gap-2 px-5 py-2 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600 transition transform hover:scale-105 w-full sm:w-auto justify-center"
            >
              <FiClock /> Pending
            </button>
            <button
              onClick={() => handleStatusChange("Investigating")}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition transform hover:scale-105 w-full sm:w-auto justify-center"
            >
              <FiSearch /> Investigating
            </button>
            <button
              onClick={() => handleStatusChange("Resolved")}
              className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition transform hover:scale-105 w-full sm:w-auto justify-center"
            >
              <FiCheckCircle /> Resolved
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
