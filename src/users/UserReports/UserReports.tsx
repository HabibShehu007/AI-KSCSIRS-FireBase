import { useEffect, useState } from "react";
import ReportCard from "./ReportCard";
import ReportFilter from "./ReportFilter";
import ReportModal from "./ReportModal";

type Complaint = {
  id: number;
  user: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  address: string;
  files: string[];
  voiceNote?: string;
  timestamp: string;
  status: string;
  department: string;
};

export default function UserReports() {
  const [reports, setReports] = useState<Complaint[]>([]);
  const [filtered, setFiltered] = useState<Complaint[]>([]);
  const [status, setStatus] = useState("");
  const [department, setDepartment] = useState("");
  const [selectedReport, setSelectedReport] = useState<Complaint | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    let email = "";

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      email = parsed.email;
    }

    const allReports: Complaint[] = [];
    const departments = [
      "police",
      "immigration",
      "fireservice",
      "roadsafety",
      "civildefence",
      "vigilante",
      "dss",
      "efcc",
    ];

    departments.forEach((dept) => {
      const deptReports = JSON.parse(
        localStorage.getItem(`complaints_${dept}`) || "[]"
      ) as Complaint[];
      allReports.push(...deptReports);
    });

    const userReports = allReports.filter((r) => r.email === email);
    setReports(userReports);
  }, []);

  useEffect(() => {
    let filteredReports = [...reports];
    if (status) {
      filteredReports = filteredReports.filter((r) => r.status === status);
    }
    if (department) {
      filteredReports = filteredReports.filter(
        (r) => r.department === department
      );
    }
    setFiltered(filteredReports);
  }, [status, department, reports]);

  const handleFilterChange = (field: string, value: string) => {
    if (field === "status") setStatus(value);
    if (field === "department") setDepartment(value);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-[#0a1f44] mb-4">My Reports</h2>

      <ReportFilter
        status={status}
        department={department}
        onFilterChange={handleFilterChange}
      />

      {filtered.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center text-gray-700 shadow-sm">
          <p className="text-lg font-medium">No reports match your filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onView={() => setSelectedReport(report)}
            />
          ))}
        </div>
      )}

      {selectedReport && (
        <ReportModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}
