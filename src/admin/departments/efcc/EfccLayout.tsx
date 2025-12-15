// src/admin/efcc/EfccLayout.tsx
import { useRef, useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { joinEfccRoom } from "./efccListener";
import {
  FiHome,
  FiSettings,
  FiBellOff,
  FiBell,
  FiLogOut,
  FiAlertCircle,
  FiBarChart2,
  FiMenu,
  FiX,
  FiUser,
} from "react-icons/fi";

export default function EfccLayout() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem("efcc-muted") === "true";
  });
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [newestComplaintId, setNewestComplaintId] = useState<string | null>(
    null
  );
  const [mobileOpen, setMobileOpen] = useState(false); // ✅ mobile nav toggle
  const navigate = useNavigate();

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    localStorage.setItem("efcc-muted", String(next));
  };

  useEffect(() => {
    const unsubscribe = joinEfccRoom((complaints, newest) => {
      localStorage.setItem("complaints-efcc", JSON.stringify(complaints));

      if (newest && newest.id !== newestComplaintId) {
        setHasNewMessage(true);
        setNewestComplaintId(newest.id);

        if (!isMuted && audioRef.current) {
          audioRef.current.play();
        }
      }
    });

    return () => unsubscribe();
  }, [isMuted, newestComplaintId]);

  const handleEngage = () => {
    setHasNewMessage(false);
    if (newestComplaintId) {
      navigate(`/admin/efcc/complaint/${newestComplaintId}`);
    } else {
      navigate("/admin/efcc/inbox");
    }
  };

  const NavLinks = () => (
    <nav className="flex-1 p-4 space-y-2">
      <Link
        to="/admin/efcc"
        className="flex items-center gap-2 py-2 px-3 rounded hover:bg-[#09203b]"
        onClick={() => setMobileOpen(false)}
      >
        <FiHome /> Dashboard
      </Link>
      <Link
        to="/admin/efcc/analytics"
        className="flex items-center gap-2 py-2 px-3 rounded hover:bg-[#09203b]"
        onClick={() => setMobileOpen(false)}
      >
        <FiBarChart2 /> Analytics
      </Link>
      <Link
        to="/admin/efcc/settings"
        className="flex items-center gap-2 py-2 px-3 rounded hover:bg-[#09203b]"
        onClick={() => setMobileOpen(false)}
      >
        <FiSettings /> Settings
      </Link>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Sidebar (desktop only) */}
      <aside className="hidden md:flex w-64 bg-[#0a1f44] text-white flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          EFCC Portal
        </div>
        <NavLinks />
      </aside>

      {/* Mobile Navbar (slide-in) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden flex"
          onClick={() => setMobileOpen(false)} // ✅ clicking outside closes
        >
          {/* Sidebar panel */}
          <div
            className={`w-64 bg-[#0a1f44] text-white h-full flex flex-col transform transition-transform duration-300 ease-in-out ${
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()} // ✅ prevent closing when clicking inside
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <span className="text-xl font-bold">Efcc Portal</span>
              <button onClick={() => setMobileOpen(false)}>
                <FiX className="text-2xl" />
              </button>
            </div>
            <NavLinks />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center p-3 sm:p-4 bg-white shadow">
          {/* Left side: menu + user icon */}
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded bg-gray-200 hover:bg-gray-300"
              onClick={() => setMobileOpen(true)}
            >
              <FiMenu className="text-lg sm:text-xl text-[#0a1f44]" />
            </button>

            {/* User icon */}
            <div className="flex items-center">
              <FiUser className="text-2xl sm:text-3xl text-blue-900" />
              <span className="hidden sm:inline text-sm font-semibold text-blue-900 ml-2">
                Efcc Admin
              </span>
            </div>
          </div>

          {/* Right side: actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleMute}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-full font-semibold text-xs sm:text-sm ${
                isMuted ? "bg-gray-400 text-white" : "bg-red-600 text-white"
              }`}
            >
              {isMuted ? <FiBellOff /> : <FiBell />}
              {isMuted ? "Unmute" : "Mute"}
            </button>
            <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-red-600 text-white rounded hover:bg-red-700 text-xs sm:text-sm font-semibold">
              <FiLogOut /> Logout
            </button>
          </div>
        </header>

        <main className="p-6">
          <audio ref={audioRef} src="/assets/alert.mp3" preload="auto" />
          <Outlet />
        </main>
      </div>

      {/* Overlay for new complaint */}
      {hasNewMessage && newestComplaintId && (
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
