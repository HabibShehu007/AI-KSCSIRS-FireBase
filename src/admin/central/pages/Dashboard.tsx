import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiUsers,
  FiBriefcase,
  FiAlertCircle,
  FiSend,
  FiMessageSquare,
} from "react-icons/fi";

type Message = {
  user: string;
  department: string;
  subject: string;
  message: string;
  timestamp: string;
};

type Complaint = {
  user: string;
  subject: string;
  message: string;
  status: string;
  timestamp: string;
};

export default function Dashboard() {
  const [totalUsers, setTotalUsers] = useState<string | number>("Loading...");
  const [totalComplaints, setTotalComplaints] = useState<string | number>(
    "Loading..."
  );
  const [totalStaffs, setTotalStaffs] = useState<string | number>("Loading...");

  const [messages, setMessages] = useState<Message[]>([]);
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/admin/dashboard/central")
      .then((res) => {
        const data = res.data;
        console.log("📦 Backend JSON:", data);

        setTotalUsers(data.totalUsers ?? "Error");
        setTotalStaffs(typeof data.staffs === "number" ? data.staffs : "Error");

        if (Array.isArray(data.complaints)) {
          // ✅ Count complaints by simply using length
          setTotalComplaints(data.complaints.length);
          setRecentComplaints(data.complaints.slice(0, 6));
        } else {
          setTotalComplaints("Error");
          setRecentComplaints([]);
        }

        if (Array.isArray(data.messages)) {
          setMessages(data.messages.slice(0, 6));
        } else {
          setMessages([]);
        }
      })
      .catch(() => {
        setTotalUsers("Error");
        setTotalComplaints("Error");
        setTotalStaffs("Error");
        setMessages([]);
        setRecentComplaints([]);
      });
  }, []);

  return (
    <div className="p-6 bg-[#f5f7fa] min-h-screen">
      <h1 className="text-3xl font-bold text-[#0a1f44] mb-4 text-center">
        Admin Dashboard
      </h1>
      <p className="text-gray-700 mb-8 text-center">
        Welcome back, Admin! Here's a quick overview of your system.
      </p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Users" value={totalUsers} icon={<FiUsers />} />
        <StatCard
          title="Complaints"
          value={totalComplaints}
          icon={<FiAlertCircle />}
        />
        <StatCard title="Staffs" value={totalStaffs} icon={<FiBriefcase />} />{" "}
      </div>
      {/* Recent Messages */}
      <div className="bg-white p-6 rounded-2xl shadow mb-10">
        <h2 className="text-xl font-bold text-[#0a1f44] mb-6 flex items-center gap-2">
          <FiSend className="text-blue-600 text-2xl" />
          Recent Messages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {messages.length > 0 ? (
            messages.map((msg, i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-[#0a1f44] mb-2 truncate">
                  {msg.subject || "No Subject"}
                </h3>
                <p className="text-sm text-gray-700 mb-3 line-clamp-2 leading-relaxed">
                  {msg.message || "No message provided."}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  <span className="font-medium">{msg.user}</span> →{" "}
                  <span className="font-medium">{msg.department}</span>
                </p>
                <p className="text-xs text-gray-400">
                  {msg.timestamp
                    ? new Date(msg.timestamp).toLocaleString()
                    : "No timestamp"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No recent messages.</p>
          )}
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold text-[#0a1f44] mb-6 flex items-center gap-2">
          <FiMessageSquare className="text-yellow-600 text-2xl" />
          Recent Complaints
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {recentComplaints.length > 0 ? (
            recentComplaints.map((c, i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-[#0a1f44] mb-2 truncate">
                  {c.subject || "No Title"}
                </h3>
                <p className="text-sm text-gray-700 mb-3 line-clamp-2 leading-relaxed">
                  {c.message || "No description provided."}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  <span className="font-medium">{c.user}</span> • Status:{" "}
                  <span className="text-blue-700 font-semibold">
                    {c.status}
                  </span>
                </p>
                <p className="text-xs text-gray-400">
                  {c.timestamp
                    ? new Date(c.timestamp).toLocaleString()
                    : "No timestamp"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No recent complaints.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow text-[#0a1f44] flex flex-col items-center justify-center text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
