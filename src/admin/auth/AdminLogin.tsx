// src/admin/auth/AdminLogin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import CentralLoginForm from "./central/CentralLoginForm";
import DepartmentLoginForm from "./departmental/DepartmentLoginForm";

// Firestore imports
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function AdminLogin() {
  const [activeTab, setActiveTab] = useState<"central" | "department">(
    "central"
  );

  // Central admin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Department admin
  const [departmentEmail, setDepartmentEmail] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [department, setDepartment] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // ✅ NEW loading state
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true); // ✅ start loading

    try {
      if (activeTab === "central") {
        // ✅ Query Firestore for central admin
        const q = query(
          collection(db, "central_admins"),
          where("email", "==", email),
          where("password", "==", password)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          localStorage.setItem("adminRole", "central");
          setShowModal(true);
          setTimeout(() => navigate("/admin/central/dashboard"), 2000);
        } else {
          setErrorMessage("❌ Central admin record not found");
          setShowErrorModal(true);
        }
      } else {
        // ✅ Department admin login
        if (!department || !departmentEmail || !staffEmail) {
          setErrorMessage("Please fill all department fields");
          setShowErrorModal(true);
          return;
        }

        const q = query(
          collection(db, "department_admins"),
          where("departmentEmail", "==", departmentEmail),
          where("staffEmail", "==", staffEmail),
          where("password", "==", password),
          where("department", "==", department)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          localStorage.setItem("adminRole", "department");
          localStorage.setItem("adminDepartment", department);

          const routeMap: Record<string, string> = {
            police: "/admin/police",
            dss: "/admin/dss",
            civildefence: "/admin/civildefence",
            vigilante: "/admin/vigilante",
            roadsafety: "/admin/roadsafety",
            fireservice: "/admin/fireservice",
            efcc: "/admin/efcc",
            immigration: "/admin/immigration",
          };

          const targetRoute = routeMap[department.toLowerCase()] || "";
          if (targetRoute) {
            setShowModal(true);
            setTimeout(() => navigate(targetRoute), 2000);
          } else {
            setErrorMessage("Unknown department selected");
            setShowErrorModal(true);
          }
        } else {
          setErrorMessage("❌ Department admin record not found");
          setShowErrorModal(true);
        }
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setErrorMessage("⚠️ Something went wrong. Try again.");
      setShowErrorModal(true);
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1f44] px-4 sm:px-6">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md relative">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Admin Logo" className="h-16 sm:h-20" />
        </div>

        {/* Tabs */}
        <div className="relative mb-6">
          <div className="flex justify-between bg-gray-100 rounded-t overflow-hidden">
            <button
              onClick={() => setActiveTab("central")}
              className={`w-1/2 py-2 sm:py-3 text-center font-semibold transition-all duration-300 ${
                activeTab === "central" ? "text-[#0a1f44]" : "text-gray-500"
              }`}
            >
              Central Admin
            </button>
            <button
              onClick={() => setActiveTab("department")}
              className={`w-1/2 py-2 sm:py-3 text-center font-semibold transition-all duration-300 ${
                activeTab === "department" ? "text-[#0a1f44]" : "text-gray-500"
              }`}
            >
              Department Admin
            </button>
          </div>

          {/* Animated Tab Indicator */}
          <div
            className={`absolute bottom-0 left-0 h-1 bg-[#0a1f44] transition-all duration-300 ${
              activeTab === "central"
                ? "w-1/2 translate-x-0"
                : "w-1/2 translate-x-full"
            }`}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {activeTab === "central" ? (
            <CentralLoginForm
              email={email}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
            />
          ) : (
            <DepartmentLoginForm
              departmentEmail={departmentEmail}
              staffEmail={staffEmail}
              password={password}
              department={department}
              setDepartmentEmail={setDepartmentEmail}
              setStaffEmail={setStaffEmail}
              setPassword={setPassword}
              setDepartment={setDepartment}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md transition font-semibold text-sm sm:text-base shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#0a1f44] text-white hover:bg-[#09203b]"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                  ></path>
                </svg>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Success Modal */}
        {showModal && (
          <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center rounded-lg animate-fadeIn">
            <div className="text-center px-4">
              <h3 className="text-lg sm:text-xl font-bold text-[#0a1f44] mb-2">
                Login Successful
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Redirecting to dashboard...
              </p>
            </div>
          </div>
        )}

        {/* Error Modal */}
        {showErrorModal && (
          <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center rounded-lg animate-fadeIn">
            <div className="text-center px-4">
              <h3 className="text-lg sm:text-xl font-bold text-red-600 mb-2">
                Login Failed
              </h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                {errorMessage}
              </p>
              <button
                onClick={() => setShowErrorModal(false)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm sm:text-base"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
