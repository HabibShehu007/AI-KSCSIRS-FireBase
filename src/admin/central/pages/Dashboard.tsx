// src/admin/central/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import {
  FiUsers,
  FiBriefcase,
  FiAlertCircle,
  FiSend,
  FiMessageSquare,
} from "react-icons/fi";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../../firebase";
import type { Complaint } from "../../../users/message/firebaseStorage";
// ✅ Complaint type comes from firebaseStorage

// ✅ Union type for possible Firestore timestamp shapes
type FirestoreTimestamp =
  | { seconds: number; nanoseconds: number } // raw Firestore timestamp
  | { toDate: () => Date } // Firestore Timestamp object
  | number
  | string
  | Date
  | undefined;

// ✅ Define Message locally since it's not exported from firebaseStorage
type Message = {
  id: string;
  user: string;
  department: string;
  subject: string;
  message: string;
  timestamp?: FirestoreTimestamp;
};

export default function Dashboard() {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalComplaints, setTotalComplaints] = useState<number>(0);
  const [totalStaffs, setTotalStaffs] = useState<number>(0);

  const [messages, setMessages] = useState<Message[]>([]);
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Users count
        const usersSnap = await getDocs(collection(db, "users"));
        setTotalUsers(usersSnap.size);

        // ✅ Staffs count
        const staffsSnap = await getDocs(collection(db, "staffs"));
        setTotalStaffs(staffsSnap.size);

        // ✅ Complaints
        const complaintsSnap = await getDocs(collection(db, "complaints"));
        const complaints: Complaint[] = complaintsSnap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Complaint, "id">),
        }));
        setTotalComplaints(complaints.length);
        setRecentComplaints(complaints.slice(0, 6));

        // ✅ Messages (latest 6)
        const messagesQuery = query(
          collection(db, "messages"),
          orderBy("timestamp", "desc"),
          limit(6)
        );
        const messagesSnap = await getDocs(messagesQuery);
        const msgs: Message[] = messagesSnap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Message, "id">),
        }));
        setMessages(msgs);
      } catch (err) {
        console.error("❌ Failed to load dashboard data", err);
      }
    };

    fetchData();
  }, []);

  // ✅ Helper to format timestamp safely
  const formatTimestamp = (ts: FirestoreTimestamp): string => {
    if (!ts) return "No timestamp";

    if (typeof ts === "object" && ts !== null) {
      if ("seconds" in ts) {
        return new Date(ts.seconds * 1000).toLocaleString();
      }
      if ("toDate" in ts && typeof ts.toDate === "function") {
        return ts.toDate().toLocaleString();
      }
    }

    if (typeof ts === "number") {
      return new Date(ts).toLocaleString();
    }
    if (typeof ts === "string") {
      return new Date(Number(ts)).toLocaleString();
    }
    if (ts instanceof Date) {
      return ts.toLocaleString();
    }

    return "Invalid timestamp";
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 bg-[#f5f7fa] min-h-screen">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0a1f44] mb-4 text-center">
        Admin Dashboard
      </h1>
      <p className="text-gray-700 mb-8 text-center text-sm sm:text-base">
        Welcome back, Admin! Here's a quick overview of your system.
      </p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-10">
        <StatCard title="Total Users" value={totalUsers} icon={<FiUsers />} />
        <StatCard
          title="Complaints"
          value={totalComplaints}
          icon={<FiAlertCircle />}
        />
        <StatCard title="Staffs" value={totalStaffs} icon={<FiBriefcase />} />
      </div>

      {/* Recent Messages */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow mb-10">
        <h2 className="text-lg sm:text-xl font-bold text-[#0a1f44] mb-4 sm:mb-6 flex items-center gap-2">
          <FiSend className="text-blue-600 text-xl sm:text-2xl" />
          Recent Messages
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-base sm:text-lg font-semibold text-[#0a1f44] mb-2 truncate">
                  {msg.subject || "No Subject"}
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 mb-3 line-clamp-2 leading-relaxed">
                  {msg.message || "No message provided."}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">
                  <span className="font-medium">{msg.user}</span> →{" "}
                  <span className="font-medium">{msg.department}</span>
                </p>
                <p className="text-[11px] sm:text-xs text-gray-400">
                  {formatTimestamp(msg.timestamp)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No recent messages.</p>
          )}
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow">
        <h2 className="text-lg sm:text-xl font-bold text-[#0a1f44] mb-4 sm:mb-6 flex items-center gap-2">
          <FiMessageSquare className="text-yellow-600 text-xl sm:text-2xl" />
          Recent Complaints
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {recentComplaints.length > 0 ? (
            recentComplaints.map((c) => (
              <div
                key={c.id}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-base sm:text-lg font-semibold text-[#0a1f44] mb-2 truncate">
                  {c.subject || "No Title"}
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 mb-3 line-clamp-2 leading-relaxed">
                  {c.message || "No description provided."}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">
                  <span className="font-medium">{c.user}</span> • Status:{" "}
                  <span className="text-blue-700 font-semibold">
                    {c.status}
                  </span>
                </p>
                <p className="text-[11px] sm:text-xs text-gray-400">
                  {formatTimestamp(c.timestamp)}
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
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow text-[#0a1f44] flex flex-col items-center justify-center text-center">
      <div className="text-2xl sm:text-3xl mb-2">{icon}</div>
      <h2 className="text-sm sm:text-lg font-semibold">{title}</h2>
      <p className="text-lg sm:text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
