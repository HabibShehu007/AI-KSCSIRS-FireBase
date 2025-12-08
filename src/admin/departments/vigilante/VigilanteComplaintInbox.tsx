import type { Complaint } from "./types";
import { Link } from "react-router-dom";

type Props = {
  complaints?: Complaint[];
};

export default function VigilanteComplaintInbox({ complaints = [] }: Props) {
  console.log("📨 VigilanteInbox received complaints:", complaints);

  const sorted = complaints.sort(
    (a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0)
  );

  console.log("📊 Sorted complaints:", sorted);

  return (
    <div className="space-y-4">
      {sorted.length === 0 ? (
        <p className="text-gray-600">No pending complaints at the moment.</p>
      ) : (
        sorted.map((c) => (
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
                  ? new Date(c.timestamp).toLocaleString()
                  : "No timestamp"}
              </p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
