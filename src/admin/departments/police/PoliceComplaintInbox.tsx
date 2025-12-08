// src/admin/departments/police/PoliceComplaintInbox.tsx
import type { Complaint } from "./types";
import { Link } from "react-router-dom";

type Props = {
  complaints?: Complaint[];
};

export default function PoliceComplaintInbox({ complaints = [] }: Props) {
  console.log("📨 PoliceComplaintInbox received complaints:", complaints); // Debug log

  const sorted = complaints.sort(
    (a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0)
  );

  console.log("📊 Sorted complaints:", sorted); // Debug log

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {sorted.length === 0 ? (
        <p className="text-gray-600 text-center py-8 text-lg font-semibold">
          No pending complaints at the moment.
        </p>
      ) : (
        sorted.map((c) => (
          <Link
            to={`/admin/police/complaint/${c.id}`}
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
                    ? new Date(c.timestamp).toLocaleString()
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
