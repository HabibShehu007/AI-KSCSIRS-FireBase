import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/logo.png";
import CentralLoginForm from "./central/CentralLoginForm";
import DepartmentLoginForm from "./departmental/DepartmentLoginForm";

// Define payload types
type CentralPayload = {
  email: string;
  password: string;
  role: "central";
};

type DepartmentPayload = {
  departmentEmail: string;
  email: string; // staffEmail mapped to "email" for backend
  password: string;
  role: "department";
  department: string;
};

type LoginPayload = CentralPayload | DepartmentPayload;

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
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let payload: LoginPayload;

      if (activeTab === "central") {
        payload = { email, password, role: "central" };
      } else {
        if (!department || !departmentEmail || !staffEmail) {
          setErrorMessage("Please fill all department fields");
          setShowErrorModal(true);
          return;
        }

        payload = {
          departmentEmail,
          email: staffEmail, // backend expects "email" but it's staff_email
          password,
          role: "department",
          department,
        };
      }

      const res = await axios.post(
        "http://localhost:3000/admin/login",
        payload
      );

      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminRole", activeTab);

      if (activeTab === "department") {
        localStorage.setItem("adminDepartment", department);

        // Map department to route
        const routeMap: Record<string, string> = {
          police: "/admin/police",
          dss: "/admin/dss",
          civildefence: "/admin/civil-defence",
          vigilante: "/admin/vigilante", // 🆕 Community Watch activated
        };

        const targetRoute = routeMap[department.toLowerCase()];
        if (targetRoute) {
          setShowModal(true);
          setTimeout(() => navigate(targetRoute), 2000);
        } else {
          setErrorMessage("Unknown department selected");
          setShowErrorModal(true);
        }
      } else {
        setShowModal(true);
        setTimeout(() => navigate("/admin/central"), 2000);
      }
    } catch {
      setErrorMessage("Invalid credentials or server error");
      setShowErrorModal(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1f44]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Admin Logo" className="h-20" />
        </div>

        {/* Tabs */}
        <div className="relative mb-6">
          <div className="flex justify-between bg-gray-100 rounded-t overflow-hidden">
            <button
              onClick={() => setActiveTab("central")}
              className={`w-1/2 py-3 text-center font-semibold transition-all duration-300 ${
                activeTab === "central" ? "text-[#0a1f44]" : "text-gray-500"
              }`}
            >
              Central Admin
            </button>
            <button
              onClick={() => setActiveTab("department")}
              className={`w-1/2 py-3 text-center font-semibold transition-all duration-300 ${
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
            className="w-full bg-[#0a1f44] text-white py-2 rounded-md hover:bg-[#09203b] transition"
          >
            Login
          </button>
        </form>

        {/* Success Modal */}
        {showModal && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg animate-fadeIn">
            <div className="text-center">
              <h3 className="text-xl font-bold text-[#0a1f44] mb-2">
                Login Successful
              </h3>
              <p className="text-gray-600">Redirecting to dashboard...</p>
            </div>
          </div>
        )}

        {/* Error Modal */}
        {showErrorModal && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg animate-fadeIn">
            <div className="text-center">
              <h3 className="text-xl font-bold text-red-600 mb-2">
                Login Failed
              </h3>
              <p className="text-gray-600 mb-4">{errorMessage}</p>
              <button
                onClick={() => setShowErrorModal(false)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
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
