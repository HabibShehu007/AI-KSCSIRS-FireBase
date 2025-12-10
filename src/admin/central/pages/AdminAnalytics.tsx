// src/admin/central/pages/AdminAnalytics.tsx
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
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../../firebase"; // ✅ adjust path if needed

type UserStat = { date: string; count: number };
type ComplaintStat = { department: string; count: number };
type Complaint = {
  id: string;
  user: string;
  department: string;
  message: string;
  timestamp: number;
  status?: string;
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
    const fetchData = async () => {
      // ✅ Users count
      const usersSnap = await getDocs(collection(db, "users"));
      const usersCount = usersSnap.size;

      // ✅ Complaints
      const complaintsSnap = await getDocs(collection(db, "complaints"));
      const complaints: Complaint[] = complaintsSnap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Complaint, "id">),
      }));

      // Totals
      setTotals({
        users: usersCount,
        complaints: complaints.length,
        departments: new Set(complaints.map((c) => c.department)).size,
      });

      // ✅ Complaints by department
      const deptCounts: Record<string, number> = {};
      complaints.forEach((c) => {
        deptCounts[c.department] = (deptCounts[c.department] || 0) + 1;
      });
      setComplaintStats(
        Object.entries(deptCounts).map(([department, count]) => ({
          department,
          count,
        }))
      );

      // ✅ Recent complaints (last 5)
      const recentQuery = query(
        collection(db, "complaints"),
        orderBy("timestamp", "desc"),
        limit(5)
      );
      const recentSnap = await getDocs(recentQuery);
      setRecentComplaints(
        recentSnap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Complaint, "id">),
        }))
      );

      // ✅ Example user stats (aggregate signups per day)
      // For now, just mock with total users spread across days
      setUserStats([
        { date: "Today", count: usersCount },
        { date: "Yesterday", count: Math.max(usersCount - 2, 0) },
      ]);
    };

    fetchData();
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
              {complaintStats.map((_, index) => (
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
                {new Date(Number(c.timestamp)).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
