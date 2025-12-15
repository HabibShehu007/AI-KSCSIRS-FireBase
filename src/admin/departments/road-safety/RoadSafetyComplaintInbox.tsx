// src/admin/departments/road/roadComplaintInbox.tsx
import type { Complaint } from "../../../users/message/firebaseStorage";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiPhone,
  FiMapPin,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiSearch,
} from "react-icons/fi";

type Props = {
  complaints?: Complaint[];
};

export default function RoadSafetyComplaintInbox({ complaints = [] }: Props) {
  console.log("📨 RoadSafetyComplaintInbox received complaints:", complaints);

  // ✅ Sort complaints by timestamp (newest first)
  const sorted = [...complaints].sort(
    (a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <FiAlertCircle className="text-5xl mb-4 text-red-500" />
          <p className="text-lg font-semibold">No complaints at the moment</p>
        </div>
      ) : (
        sorted.map((c) => (
          <Link
            to={`/admin/roadsafety/complaint/${c.id}`}
            key={c.id}
            className="block"
          >
            <div className="cursor-pointer bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col justify-between h-full">
              <div>
                {/* Subject */}
                <h4 className="text-xl font-extrabold text-[#0a1f44] mb-2 flex items-center gap-2">
                  <FiSearch className="text-blue-600" />
                  {c.subject || "No Subject"}
                </h4>

                {/* Message snippet */}
                <p className="text-gray-700 mb-3 line-clamp-2 font-medium">
                  {c.message || "No message provided."}
                </p>

                {/* Sender info */}
                <div className="space-y-1 text-sm text-gray-600 mb-2">
                  <p className="flex items-center gap-2">
                    <FiUser /> <span>{c.user || "Unknown"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FiPhone /> <span>{c.phone || "N/A"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FiMapPin /> <span>{c.address || "No address"}</span>
                  </p>
                  <p className="flex items-center gap-2 text-xs text-gray-500">
                    <FiClock />{" "}
                    {c.timestamp
                      ? new Date(Number(c.timestamp)).toLocaleString()
                      : "No timestamp"}
                  </p>
                </div>
              </div>

              {/* Status + View */}
              <div className="mt-4 flex justify-between items-center">
                <span
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    c.status === "Resolved"
                      ? "bg-green-100 text-green-800"
                      : c.status === "Investigating"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {c.status === "Resolved" && <FiCheckCircle />}
                  {c.status === "Investigating" && <FiSearch />}
                  {c.status === "Pending" && <FiAlertCircle />}
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
