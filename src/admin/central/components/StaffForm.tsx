// src/admin/central/components/StaffForm.tsx
import type { StaffFormData } from "../../../types/StaffTypes";

interface StaffFormProps {
  formData: StaffFormData;
  setFormData: React.Dispatch<React.SetStateAction<StaffFormData>>;
  onSubmit: (e: React.FormEvent) => void;
}

export default function StaffForm({
  formData,
  setFormData,
  onSubmit,
}: StaffFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 w-full">
      {/* Department Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Department Email
        </label>
        <input
          type="email"
          value={formData.department_email}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              department_email: e.target.value,
            }))
          }
          className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
          required
        />
      </div>

      {/* Staff Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Staff Email
        </label>
        <input
          type="email"
          value={formData.staff_email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, staff_email: e.target.value }))
          }
          className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
          required
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, password: e.target.value }))
          }
          className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
          required
        />
      </div>

      {/* Department */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Department
        </label>
        <input
          type="text"
          value={formData.department}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, department: e.target.value }))
          }
          className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
      >
        Save
      </button>
    </form>
  );
}
