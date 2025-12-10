import type { Staff } from "../../../types/StaffTypes";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

interface StaffTableProps {
  staffs: Staff[];
  onView?: (staff: Staff) => void;
  onEdit?: (staff: Staff) => void;
  onDelete?: (staff: Staff) => void;
}

export default function StaffTable({
  staffs,
  onView,
  onEdit,
  onDelete,
}: StaffTableProps) {
  if (!staffs || staffs.length === 0) {
    return (
      <p className="text-lg text-gray-600 text-center font-semibold">
        No staff available yet...
      </p>
    );
  }

  return (
    <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
      <thead className="bg-[#0a1f44] text-white">
        <tr>
          <th className="p-4 text-left font-bold text-lg">#</th>
          <th className="p-4 text-left font-bold text-lg">Department Email</th>
          <th className="p-4 text-left font-bold text-lg">Staff Email</th>
          <th className="p-4 text-left font-bold text-lg">Department</th>
          <th className="p-4 text-left font-bold text-lg">Created At</th>
          <th className="p-4 text-center font-bold text-lg">Actions</th>
        </tr>
      </thead>
      <tbody>
        {staffs.map((s, i) => (
          <tr key={s.id} className="border-t hover:bg-gray-50 transition">
            <td className="p-4 font-extrabold text-[#0a1f44]">{i + 1}</td>
            <td className="p-4 font-semibold text-[#0a1f44]">
              {s.department_email}
            </td>
            <td className="p-4 text-gray-800">{s.staff_email}</td>
            <td className="p-4 text-gray-800 capitalize">{s.department}</td>
            <td className="p-4 text-gray-600">
              {s.createdAt
                ? new Date(s.createdAt.seconds * 1000).toLocaleDateString()
                : "N/A"}
            </td>

            {/* ✅ Actions column */}
            <td className="p-4 flex items-center justify-center gap-3">
              <button
                onClick={() => onView && onView(s)}
                className="text-blue-600 hover:text-blue-800 transition"
                title="View Staff"
              >
                <FiEye className="text-xl" />
              </button>
              <button
                onClick={() => onEdit && onEdit(s)}
                className="text-green-600 hover:text-green-800 transition"
                title="Edit Staff"
              >
                <FiEdit className="text-xl" />
              </button>
              <button
                onClick={() => onDelete && onDelete(s)}
                className="text-red-600 hover:text-red-800 transition"
                title="Delete Staff"
              >
                <FiTrash2 className="text-xl" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
