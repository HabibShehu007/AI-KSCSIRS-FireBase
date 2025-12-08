import { FiMail, FiUser, FiBriefcase, FiLock, FiPlus } from "react-icons/fi";
import type { StaffFormData } from "../../../types/StaffTypes";

interface StaffFormProps {
  formData: StaffFormData;
  setFormData: React.Dispatch<React.SetStateAction<StaffFormData>>;
  onSubmit: (e: React.FormEvent) => void;
}

// Example departments list (you can fetch dynamically later)
const departments = ["police", "dss", "civildefence", "vigilante"];

export default function StaffForm({
  formData,
  setFormData,
  onSubmit,
}: StaffFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-8 bg-white p-6 rounded-xl shadow-lg"
    >
      {/* Header */}
      <h2 className="text-2xl font-extrabold text-[#0a1f44] text-center mb-6 flex items-center justify-center gap-2">
        <FiPlus className="text-blue-600" /> Add Staff to Department
      </h2>

      {/* Department Email */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <FiMail className="text-blue-600" /> Department Email
        </label>
        <input
          type="email"
          placeholder="Enter department email"
          value={formData.department_email}
          onChange={(e) =>
            setFormData({ ...formData, department_email: e.target.value })
          }
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      {/* Staff Email */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <FiUser className="text-green-600" /> Staff Email
        </label>
        <input
          type="email"
          placeholder="Enter staff email"
          value={formData.staff_email}
          onChange={(e) =>
            setFormData({ ...formData, staff_email: e.target.value })
          }
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          required
        />
      </div>

      {/* Department Dropdown */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <FiBriefcase className="text-indigo-600" /> Department
        </label>
        <select
          value={formData.department}
          onChange={(e) =>
            setFormData({ ...formData, department: e.target.value })
          }
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none capitalize"
          required
        >
          <option value="">Select department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Password */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <FiLock className="text-red-600" /> Password
        </label>
        <input
          type="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-blue-800 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-blue-900 font-bold shadow-md transition"
      >
        <FiPlus className="text-xl" /> Add Staff
      </button>
    </form>
  );
}
