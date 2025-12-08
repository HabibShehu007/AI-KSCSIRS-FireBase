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
import type { Complaint } from "./types";

const COLORS = ["#0088FE", "#FF8042"];

export default function PoliceAnalytics() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("complaints-police");
    const list = stored ? (JSON.parse(stored) as Complaint[]) : [];
    setComplaints(list);
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
  ];

  // Bar chart: offense type counts
  const offenseMap: Record<string, number> = {};
  complaints.forEach((c) => {
    offenseMap[c.subject] = (offenseMap[c.subject] || 0) + 1;
  });
  const offenseData = Object.entries(offenseMap).map(([title, count]) => ({
    title,
    count,
  }));

  // Line chart: complaints per day
  const dateMap: Record<string, number> = {};
  complaints.forEach((c) => {
    const date = new Date(c.timestamp).toLocaleDateString();
    dateMap[date] = (dateMap[date] || 0) + 1;
  });
  const dateData = Object.entries(dateMap).map(([date, count]) => ({
    date,
    count,
  }));

  return (
    <div className="space-y-12 p-8">
      <h2 className="text-3xl font-bold text-[#0a1f44]">
        Police Complaint Analytics
      </h2>

      {/* Status Pie Chart */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Complaint Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
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

      {/* Offense Bar Chart */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Offense Types</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={offenseData}>
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#0088FE" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Line Chart */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Complaints Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dateData}>
            <XAxis dataKey="date" />
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
  );
}
