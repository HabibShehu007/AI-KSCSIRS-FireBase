// src/admin/departments/civildefence/CivilDefenceLayout.tsx
import { useRef, useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import type { Complaint } from "../../../users/message/firebaseStorage"; // ✅ use the new Complaint type
import { listenToComplaints } from "../../../users/message/firebaseListener"; // ✅ Firestore listener
import {
  FiHome,
  FiSettings,
  FiBellOff,
  FiBell,
  FiLogOut,
  FiAlertCircle,
  FiBarChart2,
} from "react-icons/fi";

export default function CivilDefenceLayout() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem("cd-muted") === "true";
  });
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [lastAlertedId, setLastAlertedId] = useState<string | null>(null); // Firestore IDs are strings
  const navigate = useNavigate();

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    localStorage.setItem("cd-muted", String(next));
  };

  useEffect(() => {
    // ✅ Subscribe to Firestore complaints for Civil Defence department
    const unsubscribe = listenToComplaints(
      "civildefence",
      (complaints: Complaint[]) => {
        const pending = complaints
          .filter((c) => c.status === "Pending")
          .sort((a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0));

        const latest = pending[0];
        const isNew = latest && latest.id !== lastAlertedId;

        setHasNewMessage(pending.length > 0);

        if (isNew && !isMuted && audioRef.current) {
          audioRef.current.play();
          setLastAlertedId(latest.id);
        }

        // Cache complaints locally if needed
        localStorage.setItem(
          "complaints-civildefence",
          JSON.stringify(complaints)
        );
      }
    );

    return () => unsubscribe();
  }, [isMuted, lastAlertedId]);

  const handleEngage = () => {
    setHasNewMessage(false);
    setLastAlertedId(null);

    const stored = localStorage.getItem("complaints-civildefence");
    const list: Complaint[] = stored ? JSON.parse(stored) : [];
    const pending = list
      .filter((c) => c.status === "Pending")
      .sort((a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0));

    if (pending.length > 0) {
      navigate(`/admin/civil-defence/complaint/${pending[0].id}`);
    } else {
      navigate("/admin/civil-defence/inbox");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a1f44] text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          Civil Defence Portal
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/admin/civil-defence"
            className="flex items-center gap-2 py-2 px-3 rounded hover:bg-[#09203b]"
          >
            <FiHome /> Dashboard
          </Link>
          <Link
            to="/admin/civil-defence/analytics"
            className="flex items-center gap-2 py-2 px-3 rounded hover:bg-[#09203b]"
          >
            <FiBarChart2 /> Analytics
          </Link>
          <Link
            to="/admin/civil-defence/settings"
            className="flex items-center gap-2 py-2 px-3 rounded hover:bg-[#09203b]"
          >
            <FiSettings /> Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center p-4 bg-white shadow">
          <h1 className="text-xl font-bold text-blue-900">
            Civil Defence Department Portal
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMute}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm ${
                isMuted ? "bg-gray-400 text-white" : "bg-red-600 text-white"
              }`}
            >
              {isMuted ? <FiBellOff /> : <FiBell />}
              {isMuted ? "Unmute Alerts" : "Mute Alerts"}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              <FiLogOut /> Logout
            </button>
          </div>
        </header>

        <main className="p-6">
          <audio ref={audioRef} src="/assets/alert.mp3" preload="auto" />
          <Outlet />
        </main>
      </div>

      {hasNewMessage && (
        <div className="fixed inset-0 bg-red-700 bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-center text-white">
            <FiAlertCircle className="mx-auto text-6xl mb-4" />
            <h2 className="text-2xl font-bold mb-2">New Complaint Received</h2>
            <p className="mb-6">Click engage to view the complaint</p>
            <button
              onClick={handleEngage}
              className="px-6 py-2 bg-white text-red-700 font-semibold rounded hover:bg-gray-200"
            >
              Engage
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
