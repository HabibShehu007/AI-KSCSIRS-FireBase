import { NavLink } from "react-router-dom";
import { FiHome, FiUsers, FiActivity, FiUserPlus } from "react-icons/fi";

export default function Sidebar() {
  const linkClass =
    "flex items-center gap-5 px-4 py-3 text-white hover:bg-[#09203b] transition rounded-md";
  const activeClass = "bg-[#09203b]";

  return (
    <aside className="w-64 bg-[#0a1f44] text-white min-h-screen p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">Admin Panel</h2>
      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/admin/central/dashboard"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <FiHome className="text-xl" />
          Admin Dashboard
        </NavLink>

        <NavLink
          to="/admin/central/users"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <FiUsers className="text-xl" />
          Users Management
        </NavLink>

        {/* ✅ Updated route to match AdminStaffPage */}
        <NavLink
          to="/admin/central/staff"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <FiUserPlus className="text-xl" />
          Staff Management
        </NavLink>

        <NavLink
          to="/admin/central/activity"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <FiActivity className="text-xl" />
          System Activity
        </NavLink>
      </nav>
    </aside>
  );
}
