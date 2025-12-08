import { useRef, useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import type { Complaint } from "./types";
import {
  FiHome,
  FiSettings,
  FiBellOff,
  FiBell,
  FiLogOut,
  FiAlertCircle,
  FiBarChart2,
} from "react-icons/fi";

export default function PoliceLayout() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem("police-muted") === "true";
  });
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [lastAlertedId, setLastAlertedId] = useState<number | null>(null);
  const navigate = useNavigate();

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    localStorage.setItem("police-muted", String(next));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const stored = localStorage.getItem("complaints-police");
      const list: Complaint[] = stored ? JSON.parse(stored) : [];

      const pending = list
        .filter((c) => c.status === "Pending")
        .sort((a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0));

      const latest = pending[0];
      const isNew = latest && latest.id !== lastAlertedId;

      setHasNewMessage(pending.length > 0);

      if (isNew && !isMuted && audioRef.current) {
        audioRef.current.play();
        setLastAlertedId(latest.id);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isMuted, lastAlertedId]);

  const handleEngage = () => {
    setHasNewMessage(false);
    setLastAlertedId(null);
    const stored = localStorage.getItem("complaints-police");
    const list: Complaint[] = stored ? JSON.parse(stored) : [];
    const pending = list
      .filter((c) => c.status === "Pending")
      .sort((a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0));
    if (pending.length > 0) {
      navigate(`/admin/police/complaint/${pending[0].id}`);
    } else {
      navigate("/admin/police/inbox");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a1f44] text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          Police Portal
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/admin/police"
            className="flex items-center gap-2 py-2 px-3 rounded hover:bg-[#09203b]"
          >
            <FiHome /> Dashboard
          </Link>
          <Link
            to="/admin/police/analytics"
            className="flex items-center gap-2 py-2 px-3 rounded hover:bg-[#09203b]"
          >
            <FiBarChart2 /> Analytics
          </Link>
          <Link
            to="/admin/police/settings"
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
            Police Department Portal
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
