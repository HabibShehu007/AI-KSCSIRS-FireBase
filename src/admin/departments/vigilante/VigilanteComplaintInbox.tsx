// src/admin/departments/vigilante/VigilanteComplaintInbox.tsx
import { useEffect, useState } from "react";
import type { Complaint } from "../../../users/message/firebaseStorage"; // ✅ use the new Complaint type
import { listenToComplaints } from "../../../users/message/firebaseListener"; // ✅ Firestore listener
import { Link } from "react-router-dom";

export default function VigilanteComplaintInbox() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    // ✅ Subscribe to Firestore complaints for Vigilante department
    const unsubscribe = listenToComplaints(
      "vigilante",
      (incoming: Complaint[]) => {
        const sorted = [...incoming].sort(
          (a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0)
        );
        setComplaints(sorted);
      }
    );

    return () => unsubscribe();
  }, []);

  console.log("📨 VigilanteInbox received complaints:", complaints);

  return (
    <div className="space-y-4">
      {complaints.length === 0 ? (
        <p className="text-gray-600">No pending complaints at the moment.</p>
      ) : (
        complaints.map((c) => (
          <Link
            to={`/admin/vigilante/complaint/${c.id}`}
            key={c.id}
            className="block"
          >
            <div className="border p-4 rounded shadow bg-white hover:bg-gray-50 transition">
              <h4 className="font-bold text-lg mb-1">
                {c.subject || "No Subject"}
              </h4>
              <p className="mb-2">{c.message || "No message provided."}</p>
              <p className="text-sm text-gray-600">
                From: {c.user || "Unknown"} ({c.phone || "N/A"}) •{" "}
                {c.address || "No address"}
              </p>
              <p className="text-sm font-semibold text-red-600">
                Status: {c.status}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {c.timestamp
                  ? new Date(Number(c.timestamp)).toLocaleString()
                  : "No timestamp"}
              </p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
