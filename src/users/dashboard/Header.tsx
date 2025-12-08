import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiHome,
  FiFileText,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    navigate("/user/auth/login"); // ✅ Must match your route definition
  };

  const navLinks = [
    { to: "/user/dashboard", label: "Home", icon: <FiHome /> },
    { to: "/user/reports", label: "My Reports", icon: <FiFileText /> },
    { to: "/user/profile", label: "Profile", icon: <FiUser /> },
    { to: null, label: "Logout", icon: <FiLogOut />, action: handleLogout },
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex justify-between items-center px-8 py-4 bg-[#0a1f44] text-white shadow-lg">
        <h1 className="text-2xl font-extrabold tracking-wide">
          KSCSIRS Dashboard
        </h1>
        <nav className="flex items-center space-x-8 text-sm font-medium">
          {navLinks.map(({ to, label, icon, action }) =>
            action ? (
              <button
                key={label}
                onClick={action}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-600 transition text-left"
              >
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </button>
            ) : (
              <Link
                key={label}
                to={to!}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-600 transition"
              >
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </Link>
            )
          )}
        </nav>
      </header>

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0a1f44] text-white shadow-md">
        <h1 className="text-lg font-bold tracking-wide">KSCSIRS</h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition"
        >
          {isOpen ? (
            <FiX className="text-xl" />
          ) : (
            <FiMenu className="text-xl" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } md:hidden`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#0a1f44] text-white z-50 transform transition-transform duration-300 ease-out ${
          isOpen
            ? "translate-x-0 scale-100 opacity-100"
            : "-translate-x-full scale-95 opacity-0"
        } md:hidden`}
      >
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-bold">Menu</h2>
          <nav className="flex flex-col space-y-4 text-base">
            {navLinks.map(({ to, label, icon, action }) =>
              action ? (
                <button
                  key={label}
                  onClick={() => {
                    setIsOpen(false);
                    action();
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-600 transition text-left w-full"
                >
                  <span className="text-lg">{icon}</span>
                  <span>{label}</span>
                </button>
              ) : (
                <Link
                  key={label}
                  to={to!}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  <span className="text-lg">{icon}</span>
                  <span>{label}</span>
                </Link>
              )
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
