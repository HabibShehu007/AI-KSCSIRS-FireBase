import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

type UserStat = { date: string; count: number };
type ComplaintStat = { department: string; count: number };
type Complaint = {
  id: number;
  user: string;
  department: string;
  message: string;
  timestamp: string;
};

export default function AdminAnalytics() {
  const [userStats, setUserStats] = useState<UserStat[]>([]);
  const [complaintStats, setComplaintStats] = useState<ComplaintStat[]>([]);
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [totals, setTotals] = useState({
    users: 0,
    complaints: 0,
    departments: 0,
  });

  useEffect(() => {
    // ✅ Hardcoded user stats (last 7 days)
    setUserStats([
      { date: "Nov 15", count: 12 },
      { date: "Nov 16", count: 18 },
      { date: "Nov 17", count: 25 },
      { date: "Nov 18", count: 20 },
      { date: "Nov 19", count: 30 },
      { date: "Nov 20", count: 22 },
      { date: "Nov 21", count: 28 },
    ]);

    // ✅ Hardcoded complaints by department
    setComplaintStats([
      { department: "Police", count: 42 },
      { department: "DSS", count: 15 },
      { department: "Civil Defence", count: 25 },
      { department: "Vigilante", count: 10 },
    ]);

    // ✅ Hardcoded recent complaints
    setRecentComplaints([
      {
        id: 1,
        user: "john.doe@example.com",
        department: "Police",
        message: "Delayed response to incident.",
        timestamp: new Date().toISOString(),
      },
      {
        id: 2,
        user: "mary.smith@example.com",
        department: "Civil Defence",
        message: "Patrol not visible in my area.",
        timestamp: new Date().toISOString(),
      },
      {
        id: 3,
        user: "admin@kscsirs.com",
        department: "DSS",
        message: "Complaint about unauthorized access.",
        timestamp: new Date().toISOString(),
      },
    ]);

    // ✅ Hardcoded totals
    setTotals({
      users: 120,
      complaints: 92,
      departments: 4,
    });
  }, []);

  const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#9333ea"];

  return (
    <div className="p-6 bg-[#f5f7fa] min-h-screen">
      <h1 className="text-3xl font-bold text-[#0a1f44] mb-6 text-center">
        📊 Admin Analytics
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold text-gray-600">Total Users</h2>
          <p className="text-3xl font-bold text-[#0a1f44]">{totals.users}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold text-gray-600">
            Total Complaints
          </h2>
          <p className="text-3xl font-bold text-[#dc2626]">
            {totals.complaints}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold text-gray-600">
            Active Departments
          </h2>
          <p className="text-3xl font-bold text-[#16a34a]">
            {totals.departments}
          </p>
        </div>
      </div>

      {/* Users per day/week (Bar Chart) */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Users Activity</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#0a1f44" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Trends (Line Chart) */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Weekly Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Complaints by department (Pie Chart) */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Complaints by Department</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={complaintStats}
              dataKey="count"
              nameKey="department"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {complaintStats.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Complaints List */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Recent Complaints</h2>
        <ul className="space-y-3">
          {recentComplaints.map((c) => (
            <li key={c.id} className="border-b pb-2">
              <p className="text-gray-800">
                <strong>{c.user}</strong> complained about{" "}
                <strong>{c.department}</strong>
              </p>
              <p className="text-sm text-gray-500">{c.message}</p>
              <p className="text-xs text-gray-400">
                {new Date(c.timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
