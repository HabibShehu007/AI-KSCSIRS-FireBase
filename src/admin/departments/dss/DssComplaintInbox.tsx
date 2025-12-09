// src/admin/departments/dss/DssComplaintInbox.tsx
import { useEffect, useState } from "react";
import type { Complaint } from "../../../users/message/firebaseStorage"; // ✅ use the new Complaint type
import { listenToComplaints } from "../../../users/message/firebaseListener"; // ✅ Firestore listener
import { Link } from "react-router-dom";

export default function DssComplaintInbox() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    // ✅ Subscribe to Firestore complaints for DSS department
    const unsubscribe = listenToComplaints("dss", (incoming: Complaint[]) => {
      const sorted = [...incoming].sort(
        (a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0)
      );
      setComplaints(sorted);
    });

    return () => unsubscribe();
  }, []);

  console.log("📨 DSS ComplaintInbox received complaints:", complaints); // Debug log

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {complaints.length === 0 ? (
        <p className="text-gray-600 text-center py-8 text-lg font-semibold">
          No pending complaints at the moment.
        </p>
      ) : (
        complaints.map((c) => (
          <Link
            to={`/admin/dss/complaint/${c.id}`}
            key={c.id}
            className="block"
          >
            <div className="cursor-pointer bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col justify-between h-full">
              <div>
                <h4 className="text-xl font-extrabold text-[#0a1f44] mb-2">
                  {c.subject || "No Subject"}
                </h4>
                <p className="text-gray-700 mb-3 line-clamp-2 font-medium">
                  {c.message || "No message provided."}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-bold">From:</span>{" "}
                  <span className="font-semibold">{c.user || "Unknown"}</span> (
                  {c.phone || "N/A"}) • {c.address || "No address"}
                </p>
                <p className="text-xs text-gray-500">
                  {c.timestamp
                    ? new Date(Number(c.timestamp)).toLocaleString()
                    : "No timestamp"}
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    c.status === "Resolved"
                      ? "bg-green-100 text-green-800"
                      : c.status === "Investigating"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {c.status}
                </span>
                <span className="text-sm font-semibold text-blue-600 hover:underline">
                  View Details
                </span>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
