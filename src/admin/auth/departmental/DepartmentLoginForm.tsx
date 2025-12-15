import { FiMail, FiLock } from "react-icons/fi";

export default function DepartmentLoginForm({
  departmentEmail,
  staffEmail,
  password,
  department,
  setDepartmentEmail,
  setStaffEmail,
  setPassword,
  setDepartment,
}: {
  departmentEmail: string;
  staffEmail: string;
  password: string;
  department: string;
  setDepartmentEmail: (val: string) => void;
  setStaffEmail: (val: string) => void;
  setPassword: (val: string) => void;
  setDepartment: (val: string) => void;
}) {
  return (
    <>
      {/* Department Email */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700">
          Department Email
        </label>
        <FiMail className="absolute top-9 left-3 text-gray-400" />
        <input
          type="email"
          value={departmentEmail}
          onChange={(e) => setDepartmentEmail(e.target.value)}
          className="mt-1 pl-10 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a1f44]"
          required
        />
      </div>

      {/* Staff Email */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700">
          Staff Email
        </label>
        <FiMail className="absolute top-9 left-3 text-gray-400" />
        <input
          type="email"
          value={staffEmail}
          onChange={(e) => setStaffEmail(e.target.value)}
          className="mt-1 pl-10 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a1f44]"
          required
        />
      </div>

      {/* Password */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <FiLock className="absolute top-9 left-3 text-gray-400" />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 pl-10 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a1f44]"
          required
        />
      </div>

      {/* Department Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Department
        </label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a1f44]"
          required
        >
          <option value="">Select Department</option>
          <option value="police">Police</option>
          <option value="dss">Dss</option>
          <option value="civildefence">Civil Defence</option>
          <option value="vigilante">Vigilante (See Watch)</option>{" "}
          <option value="roadsafety">Road-Safety</option>
          <option value="fireservice">Fire-Service</option>
          <option value="immigration">Immigration</option>
          <option value="efcc">Efcc</option>
          {/* New Squad Should Be Added Here */}
        </select>
      </div>
    </>
  );
}
