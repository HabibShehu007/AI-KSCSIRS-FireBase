import { useEffect, useState } from "react";
import AgencyCard from "./AgencyCard";
import { departments } from "./agencies"; // ✅ Centralized source

// Firebase imports
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function UserDashboard() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (userId) {
      const fetchUser = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", userId));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserName(data.name || "User");
          } else {
            setUserName("User");
          }
        } catch (err) {
          console.error("❌ Failed to fetch user name:", err);
          setUserName("User");
        }
      };
      fetchUser();
    }
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-6">
      {/* Greeting Card */}
      <div className="bg-[#0a1f44] text-white py-5 px-6 rounded-lg shadow-md mb-6 max-w-md mx-auto text-center">
        <h2 className="text-xl font-semibold">
          {getGreeting()}, {userName || "User"}
        </h2>
        <p className="text-sm text-gray-300 mt-1">
          Welcome to your civic dashboard.
        </p>
      </div>

      {/* Department Grid */}
      <h2 className="text-center text-lg sm:text-xl md:text-2xl font-bold mb-3 md:mb-4 text-[#0a1f44]">
        Choose a Department to Report To
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-5">
        {departments.map((dept) => (
          <AgencyCard key={dept.slug} {...dept} />
        ))}
      </div>
    </div>
  );
}
