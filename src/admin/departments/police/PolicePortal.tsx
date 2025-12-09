import { useState, useEffect } from "react";
import type { Complaint } from "../../../users/message/firebaseStorage";
import { joinPoliceRoom } from "./policeListener";
import { Link, useNavigate } from "react-router-dom";
import NewMessageOverlay from "./NewMessageOverlay";

export default function PolicePortal() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [newestComplaint, setNewestComplaint] = useState<Complaint | null>(
    null
  );
  const [showOverlay, setShowOverlay] = useState(false);
  const navigate = useNavigate();

  // Load cached complaints
  useEffect(() => {
    const stored = localStorage.getItem("complaints-police");
    const list: Complaint[] = stored ? JSON.parse(stored) : [];
    setComplaints(list);
  }, []);

  // Subscribe to Firestore complaints
  useEffect(() => {
    const unsubscribe = joinPoliceRoom((incoming, newest) => {
      const updated = [...incoming].sort(
        (a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0)
      );

      localStorage.setItem("complaints-police", JSON.stringify(updated));
      setComplaints(updated);

      // Only trigger overlay if a truly new complaint arrived
      const lastSeenId = localStorage.getItem("lastSeenComplaintId");
      if (newest && newest.id !== lastSeenId) {
        setNewestComplaint(newest);
        setShowOverlay(true);
        localStorage.setItem("lastSeenComplaintId", newest.id);
      }
    });

    return () => unsubscribe();
  }, []);

  const resolved = complaints.filter((c) => c.status === "Resolved").length;
  const pending = complaints.filter((c) => c.status === "Pending").length;

  return (
    <div className="p-6">
      <h1 className="text-5xl font-extrabold text-[#0a1f44] mb-10 tracking-tight">
        Police Department Portal
      </h1>

      {/* Summary Cards */}
      <div className="flex justify-center">
        <div className="w-full max-w-6xl px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
            {/* Total Complaints */}
            <div className="bg-white p-6 rounded-2xl shadow-lg text-[#0a1f44] hover:shadow-xl transition text-center">
              <h2 className="text-lg font-semibold mb-2">Total Complaints</h2>
              <p className="text-4xl font-extrabold">{complaints.length}</p>
            </div>

            {/* Resolved */}
            <div className="bg-green-100 p-6 rounded-2xl shadow-lg text-green-800 hover:shadow-xl transition text-center">
              <h2 className="text-lg font-semibold mb-2">Resolved</h2>
              <p className="text-4xl font-extrabold">{resolved}</p>
            </div>

            {/* Pending */}
            <div className="bg-yellow-100 p-6 rounded-2xl shadow-lg text-yellow-800 hover:shadow-xl transition text-center">
              <h2 className="text-lg font-semibold mb-2">Pending</h2>
              <p className="text-4xl font-extrabold">{pending}</p>
            </div>

            {/* Investigating */}
            <div className="bg-blue-100 p-6 rounded-2xl shadow-lg text-blue-800 hover:shadow-xl transition text-center">
              <h2 className="text-lg font-semibold mb-2">Investigating</h2>
              <p className="text-4xl font-extrabold">
                {complaints.filter((c) => c.status === "Investigating").length}
              </p>
            </div>

            {/* Received */}
            <div className="bg-black p-6 rounded-2xl shadow-lg text-white hover:shadow-xl transition text-center">
              <h2 className="text-lg font-semibold mb-2 tracking-wide uppercase">
                Received
              </h2>
              <p className="text-4xl font-extrabold">{pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Complaint Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
        {complaints.map((c) => (
          <div key={c.id} className="rounded-2xl shadow-lg p-5">
            <h3 className="text-lg font-bold mb-1 truncate">
              {c.subject || "No Subject"}
            </h3>
            <p className="text-sm mb-2 line-clamp-3">
              {c.message || "No message provided."}
            </p>
            <div className="text-xs text-gray-600 mb-3">
              <p>
                <strong>From:</strong> {c.user || "Unknown"} ({c.phone || "N/A"}
                )
              </p>
              <p>
                <strong>Received:</strong>{" "}
                {c.timestamp
                  ? new Date(c.timestamp).toLocaleString()
                  : "No timestamp"}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold px-3 py-1 rounded-full">
                {c.status}
              </span>
              <Link
                to={`/admin/police/complaint/${c.id}`}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* New Message Overlay */}
      {showOverlay && newestComplaint && (
        <NewMessageOverlay
          onEngage={() => {
            setShowOverlay(false);
            navigate(`/admin/police/complaint/${newestComplaint.id}`); // ✅ direct ID
          }}
        />
      )}
    </div>
  );
}
