// src/admin/departments/vigilante/Analytics.tsx
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import type { Complaint } from "../../../users/message/firebaseStorage";
import { joinVigilanteRoom } from "./vigilanteListener"; // ✅ vigilante listener, same pattern as policeListener

const COLORS = ["#0088FE", "#FF8042", "#00C49F"];

export default function VigilanteAnalytics() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  // ✅ Subscribe to Firestore complaints for Vigilante department
  useEffect(() => {
    const unsubscribe = joinVigilanteRoom((incoming) => {
      setComplaints(incoming);
    });
    return () => unsubscribe();
  }, []);

  // Pie chart: status distribution
  const statusData = [
    {
      name: "Resolved",
      value: complaints.filter((c) => c.status === "Resolved").length,
    },
    {
      name: "Pending",
      value: complaints.filter((c) => c.status === "Pending").length,
    },
    {
      name: "Investigating",
      value: complaints.filter((c) => c.status === "Investigating").length,
    },
  ];

  // Bar chart: offense type counts (group by subject)
  const offenseMap: Record<string, number> = {};
  complaints.forEach((c) => {
    const key = c.subject || "Unknown"; // ✅ fallback to avoid undefined index
    offenseMap[key] = (offenseMap[key] || 0) + 1;
  });
  const offenseData = Object.entries(offenseMap).map(([title, count]) => ({
    title,
    count,
  }));

  // Line chart: complaints per day
  const dateMap: Record<string, number> = {};
  complaints.forEach((c) => {
    if (c.timestamp) {
      const date = new Date(Number(c.timestamp)).toLocaleDateString();
      dateMap[date] = (dateMap[date] || 0) + 1;
    }
  });
  const dateData = Object.entries(dateMap).map(([date, count]) => ({
    date,
    count,
  }));

  return (
    <div className="space-y-10 px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0a1f44] text-center mb-6">
        Vigilante Complaint Analytics
      </h2>

      {/* Responsive grid for charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Pie Chart */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-[#0a1f44]">
            Complaint Status
          </h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  label
                >
                  {statusData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Offense Bar Chart */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-[#0a1f44]">
            Offense Types
          </h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={offenseData}>
                <XAxis dataKey="title" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Line Chart full width */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-[#0a1f44]">
          Complaints Over Time
        </h3>
        <div className="h-64 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dateData}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#FF8042"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
