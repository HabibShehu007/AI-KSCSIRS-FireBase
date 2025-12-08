import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Complaint } from "./types";

export default function VigilanteComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [reply, setReply] = useState("");
  const [isResolved, setIsResolved] = useState(false);

  useEffect(() => {
    console.log("🔍 Loading complaint with ID:", id);
    const stored = localStorage.getItem("complaints-vigilante");
    const list = stored ? (JSON.parse(stored) as Complaint[]) : [];
    const found = list.find((c) => c.id === Number(id));
    console.log("📦 Found complaint:", found);
    setComplaint(found || null);
  }, [id]);

  const handleReply = () => {
    if (!complaint) return;

    const updated: Complaint = {
      ...complaint,
      reply,
      status: "Resolved",
    };

    console.log("✍️ Updating complaint with reply:", updated);

    const stored = localStorage.getItem("complaints-vigilante");
    const list = stored ? (JSON.parse(stored) as Complaint[]) : [];
    const newList = list.map((c) => (c.id === updated.id ? updated : c));
    localStorage.setItem("complaints-vigilante", JSON.stringify(newList));

    setIsResolved(true);
    console.log("✅ Complaint marked as resolved");

    setTimeout(() => {
      console.log("🔁 Redirecting to inbox");
      navigate("/admin/vigilante/inbox");
    }, 1500);
  };

  if (!complaint) {
    console.log("❌ Complaint not found for ID:", id);
    return <div className="text-gray-600">Complaint not found.</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Complaint Details</h2>
      <div className="bg-white p-6 rounded shadow space-y-4">
        <div>
          <p>
            <strong>Subject:</strong> {complaint.subject}
          </p>
          <p>
            <strong>Message:</strong> {complaint.message}
          </p>
          <p>
            <strong>User:</strong> {complaint.user} ({complaint.phone})
          </p>
          <p>
            <strong>Email:</strong> {complaint.email}
          </p>
          <p>
            <strong>Address:</strong> {complaint.address}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded text-white text-sm ${
                complaint.status === "Resolved"
                  ? "bg-green-600"
                  : "bg-yellow-500"
              }`}
            >
              {complaint.status}
            </span>
          </p>
          <p>
            <strong>Timestamp:</strong>{" "}
            {new Date(complaint.timestamp).toLocaleString()}
          </p>
        </div>

        {complaint.voiceNote && (
          <div>
            <strong>Voice Note:</strong>
            <audio controls src={complaint.voiceNote} className="mt-2" />
          </div>
        )}

        {complaint.files.length > 0 && (
          <div>
            <strong>Files:</strong>
            <ul className="list-disc ml-6">
              {complaint.files.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <label className="block font-semibold mb-1">Reply</label>
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={4}
            className="w-full border rounded p-2"
            placeholder="Type your response here..."
          />
        </div>

        <button
          onClick={handleReply}
          className="bg-blue-700 text-white px-6 py-2 rounded font-semibold hover:bg-blue-800"
        >
          Send Reply & Mark as Resolved
        </button>

        {isResolved && (
          <p className="text-green-600 font-semibold mt-4">
            Complaint marked as resolved. Redirecting to inbox...
          </p>
        )}
      </div>
    </div>
  );
}
