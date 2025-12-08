type Props = {
  status: string;
  department: string;
  onFilterChange: (field: string, value: string) => void;
};

export default function ReportFilter({
  status,
  department,
  onFilterChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => onFilterChange("status", e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md"
      >
        <option value="">All Status</option>
        <option value="Pending">Pending</option>
        <option value="Resolved">Resolved</option>
      </select>

      {/* Department Filter */}
      <select
        value={department}
        onChange={(e) => onFilterChange("department", e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md capitalize"
      >
        <option value="">All Departments</option>
        <option value="police">Police</option>
        <option value="dss">DSS</option>
        <option value="civildefence">Civil Defence</option>
        <option value="vigilante">Vigilante (See Watch)</option>
        <option value="roadsafety">Road Safety</option>
        <option value="fireservice">Fire Service</option>
        <option value="immigration">Immigration</option>
        <option value="efcc">EFCC</option>
      </select>
    </div>
  );
}
