import { useState, useEffect } from "react";
import type { Complaint } from "../../../users/message/firebaseStorage";
import { joinRoadSafetyRoom } from "./roadsafetyListener";
import { Link, useNavigate } from "react-router-dom";
import NewMessageOverlay from "./NewMessageOverlay";
import { Timestamp } from "firebase/firestore";

export default function RoadSafetyPortal() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [newestComplaint, setNewestComplaint] = useState<Complaint | null>(
    null
  );
  const [showOverlay, setShowOverlay] = useState(false);
  const navigate = useNavigate();

  // Load cached complaints
  useEffect(() => {
    const stored = localStorage.getItem("complaints-roadsafety");
    const list: Complaint[] = stored ? JSON.parse(stored) : [];
    setComplaints(list);
  }, []);

  // Subscribe to Firestore complaints
  useEffect(() => {
    const unsubscribe = joinRoadSafetyRoom((incoming, newest) => {
      const updated = [...incoming].sort(
        (a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0)
      );

      localStorage.setItem("complaints-roadsafety", JSON.stringify(updated));
      setComplaints(updated);

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
    <div className="p-4 sm:p-6">
      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-[#0a1f44] mb-4 sm:mb-6 md:mb-10 tracking-tight text-center">
        Road-Safety Department Portal
      </h1>

      {/* Summary Cards */}
      <div className="flex justify-center">
        <div className="w-full max-w-5xl px-2 sm:px-4">
          <div className="grid grid-cols-3 gap-3 sm:gap-5 mb-6 md:mb-10">
            {/* Total Complaints */}
            <div className="bg-white p-2 sm:p-3 rounded-lg shadow text-[#0a1f44] hover:shadow-md transition text-center min-h-20">
              <h2 className="text-xs sm:text-sm font-semibold mb-1">
                Total Complaints
              </h2>
              <p className="text-lg sm:text-xl font-extrabold">
                {complaints.length}
              </p>
            </div>

            {/* Resolved */}
            <div className="bg-green-100 p-2 sm:p-3 rounded-lg shadow text-green-800 hover:shadow-md transition text-center min-h-20">
              <h2 className="text-xs sm:text-sm font-semibold mb-1">
                Resolved
              </h2>
              <p className="text-lg sm:text-xl font-extrabold">{resolved}</p>
            </div>

            {/* Pending */}
            <div className="bg-yellow-100 p-2 sm:p-3 rounded-lg shadow text-yellow-800 hover:shadow-md transition text-center min-h-20">
              <h2 className="text-xs sm:text-sm font-semibold mb-1">Pending</h2>
              <p className="text-lg sm:text-xl font-extrabold">{pending}</p>
            </div>

            {/* Investigating */}
            <div className="bg-blue-100 p-2 sm:p-3 rounded-lg shadow text-blue-800 hover:shadow-md transition text-center min-h-20 col-span-1 row-start-2">
              <h2 className="text-xs sm:text-sm font-semibold mb-1">
                Investigating
              </h2>
              <p className="text-lg sm:text-xl font-extrabold">
                {complaints.filter((c) => c.status === "Investigating").length}
              </p>
            </div>

            {/* Received */}
            <div className="bg-black p-2 sm:p-3 rounded-lg shadow text-white hover:shadow-md transition text-center min-h-20 col-span-1 row-start-2">
              <h2 className="text-xs sm:text-sm font-semibold mb-1 tracking-wide uppercase">
                Received
              </h2>
              <p className="text-lg sm:text-xl font-extrabold">{pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Complaint Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-5">
        {complaints.map((c) => (
          <div
            key={c.id}
            className="rounded-lg shadow hover:shadow-md p-2 sm:p-3"
          >
            <h3 className="text-xs sm:text-sm font-bold mb-1 truncate">
              {c.subject || "No Subject"}
            </h3>
            <p className="text-[11px] sm:text-xs mb-2 line-clamp-3">
              {c.message || "No message provided."}
            </p>
            <div className="text-[11px] text-gray-600 mb-2">
              <p>
                <strong>From:</strong> {c.user || "Unknown"} ({c.phone || "N/A"}
                )
              </p>
              <p>
                <strong>Received:</strong>{" "}
                {c.timestamp
                  ? typeof c.timestamp === "object" && "toDate" in c.timestamp
                    ? (c.timestamp as Timestamp).toDate().toLocaleString()
                    : new Date(
                        c.timestamp as string | number | Date
                      ).toLocaleString()
                  : "N/A"}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full">
                {c.status}
              </span>
              <Link
                to={`/admin/roadsafety/complaint/${c.id}`}
                className="text-[11px] sm:text-xs font-medium text-blue-600 hover:underline"
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
            navigate(`/admin/roadsafety/complaint/${newestComplaint.id}`);
          }}
        />
      )}
    </div>
  );
}
