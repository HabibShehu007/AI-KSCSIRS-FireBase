import { FiUser, FiChevronDown, FiLogOut } from "react-icons/fi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth token/session
    localStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminToken");

    // Redirect to admin login portal
    navigate("/admin/login");
    // Or: window.location.href = "/admin/login";
  };

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm border-b relative">
      {/* Left: Page Title */}
      <h1 className="text-xl font-semibold text-[#0a1f44]">Dashboard</h1>

      {/* Right: Icons and Avatar */}
      <div className="flex items-center gap-6 relative">
        {/* User Avatar */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setShowMenu(!showMenu)}
        >
          <FiUser className="text-2xl text-[#0a1f44]" />
          <span className="text-sm text-[#0a1f44] font-medium">Admin</span>
          <FiChevronDown className="text-[#0a1f44]" />
        </div>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute top-12 right-0 bg-white border rounded-md shadow-md w-40 z-50">
            <ul className="text-sm text-[#0a1f44]">
              <li
                onClick={handleLogout}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              >
                <FiLogOut className="text-red-600" /> Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
