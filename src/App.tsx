import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Main User Flow Imports
import UserLayout from "./users/layouts/UserLayout";
import Landing from "./users/landing/Landing";
import Signup from "./users/auth/SignUp/Signup";
import Login from "./users/auth/login/Login";
import UserDashboard from "./users/dashboard/UserDashboard";
import MessagePage from "./users/message/MessagePage";
import UserReports from "./users/UserReports/UserReports";
import Profile from "./users/profile/Profile";

// Central Admin portal
import CentralLayout from "./admin/central/Layout/CentralLayout";
import AdminLogin from "./admin/auth/AdminLogin";
import Dashboard from "./admin/central/pages/Dashboard";
import Users from "./admin/central/pages/AdminUsers";
import AdminActivity from "./admin/central/pages/AdminAnalytics";
import AdminStaffPage from "./admin/central/pages/AdminStaffPage";

//  Department Imports
// Police department portal imports
import PoliceLayout from "./admin/departments/police/PoliceLayout";
import PolicePortal from "./admin/departments/police/PolicePortal";
import PoliceComplaintInbox from "./admin/departments/police/PoliceComplaintInbox";
import PoliceComplaintDetails from "./admin/departments/police/PoliceComplaintDetails";
import PoliceAnalytics from "./admin/departments/police/PoliceAnalytics";
import PoliceSettings from "./admin/departments/police/PoliceSettings";

// Dss department portal imports
import DssLayout from "./admin/departments/dss/DssLayout";
import DssPortal from "./admin/departments/dss/DssPortal";
import DssComplaintInbox from "./admin/departments/dss/DssComplaintInbox";
import DssComplaintDetails from "./admin/departments/dss/DssComplaintDetails";
import DssAnalytics from "./admin/departments/dss/DssAnalytics";
import DssSettings from "./admin/departments/dss/DssSettings";

//Civil Defence department portal imports
import CivilDefenceLayout from "./admin/departments/civil-defence/CivilDefenceLayout";
import CivilDefencePortal from "./admin/departments/civil-defence/CivilDefencePortal";
import CivilDefenceComplaintInbox from "./admin/departments/civil-defence/CivilDefenceComplaintInbox";
import CivilDefenceComplaintDetails from "./admin/departments/civil-defence/CivilDefenceComplaintDetails";
import CivilDefenceAnalytics from "./admin/departments/civil-defence/CivilDefenceAnalytics";
import CivilDefenceSettings from "./admin/departments/civil-defence/CivilDefenceSettings";

// Vigilante Department
import VigilanteLayout from "./admin/departments/vigilante/VigilanteLayout";
import VigilantePortal from "./admin/departments/vigilante/VigilantePortal";
import VigilanteComplaintInbox from "./admin/departments/vigilante/VigilanteComplaintInbox";
import VigilanteComplaintDetails from "./admin/departments/vigilante/VigilanteComplaintDetails";
import VigilanteAnalytics from "./admin/departments/vigilante/VigilanteAnalytics";
import VigilanteSettings from "./admin/departments/vigilante/VigilanteSettings";

// Road-Safety
import RoadSafetyLayout from "./admin/departments/road-safety/RoadSafetyLayout";
import RoadSafetyPortal from "./admin/departments/road-safety/RoadSafetyPortal";
import RoadSafetyComplaintInbox from "./admin/departments/road-safety/RoadSafetyComplaintInbox";
import RoadSafetyComplaintDetails from "./admin/departments/road-safety/RoadSafetyComplainDetails";
import RoadSafetyAnalytics from "./admin/departments/road-safety/RoadSafetyAnalytics";
import RoadSafetySettings from "./admin/departments/road-safety/RoadSafetySettings";

// Fire Service Imports
import FireLayout from "./admin/departments/fire-service/FireLayout";
import FirePortal from "./admin/departments/fire-service/FirePortal";
import FireComplaintInbox from "./admin/departments/fire-service/FireComplaintInbox";
import FireComplaintDetails from "./admin/departments/fire-service/FireComplaintDetails";
import FireAnalytics from "./admin/departments/fire-service/FireAnalysis";
import FireSettings from "./admin/departments/fire-service/FireSettings";

// Immigration Imports
import ImmigrationLayout from "./admin/departments/immigration/ImmigrationLayout";
import ImmigrationPortal from "./admin/departments/immigration/ImmigrationPortal";
import ImmigrationComplaintInbox from "./admin/departments/immigration/ImmigrationComplaintInbox";
import ImmigrationComplaintDetails from "./admin/departments/immigration/ImmigrationComplaintDetails";
import ImmigrationAnalytics from "./admin/departments/immigration/ImmigrationAnalytics";
import ImmigrationSettings from "./admin/departments/immigration/ImmigrationSettings";

// EFCC Imports
import EfccLayout from "./admin/departments/efcc/EfccLayout";
import EfccPortal from "./admin/departments/efcc/EfccPortal";
import EfccComplaintInbox from "./admin/departments/efcc/EfccComplaintInbox";
import EfccComplaintDetails from "./admin/departments/efcc/EfccComplaintDetails";
import EfccAnalytics from "./admin/departments/efcc/EfccAnalytics";
import EfccSettings from "./admin/departments/efcc/EfccSettings";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Main User auth Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/user/auth/signup" element={<Signup />} />
        <Route path="/user/auth/login" element={<Login />} />
        {/* User Flow flow routes */}
        <Route path="/user" element={<UserLayout />}>
          <Route path="dashboard" element={<UserDashboard />} />

          <Route path="message/:agency" element={<MessagePage />} />

          <Route path="reports" element={<UserReports />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin login route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Central Admin routes */}
        <Route path="/admin/central" element={<CentralLayout />}>
          <Route index element={<Dashboard />} />{" "}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="activity" element={<AdminActivity />} />
          <Route path="staff" element={<AdminStaffPage />} />
        </Route>

        {/* Police admin portal routes */}
        <Route path="/admin/police" element={<PoliceLayout />}>
          <Route index element={<PolicePortal />} />
          <Route path="dashboard" element={<PolicePortal />} />
          <Route
            path="inbox"
            element={<PoliceComplaintInbox complaints={[]} />}
          />
          <Route path="complaint/:id" element={<PoliceComplaintDetails />} />
          <Route path="analytics" element={<PoliceAnalytics />} />
          <Route path="settings" element={<PoliceSettings />} />
        </Route>

        {/* Dss admin portal routes */}
        <Route path="/admin/dss" element={<DssLayout />}>
          <Route index element={<DssPortal />} />
          <Route path="dashboard" element={<DssPortal />} />
          <Route path="inbox" element={<DssComplaintInbox />} />
          <Route path="complaint/:id" element={<DssComplaintDetails />} />
          <Route path="analytics" element={<DssAnalytics />} />
          <Route path="settings" element={<DssSettings />} />
        </Route>

        {/* Civil Defence admin portal routes */}
        <Route path="/admin/civil-defence" element={<CivilDefenceLayout />}>
          <Route index element={<CivilDefencePortal />} />
          <Route path="dashboard" element={<CivilDefencePortal />} />
          <Route path="inbox" element={<CivilDefenceComplaintInbox />} />
          <Route
            path="complaint/:id"
            element={<CivilDefenceComplaintDetails />}
          />
          <Route path="analytics" element={<CivilDefenceAnalytics />} />
          <Route path="settings" element={<CivilDefenceSettings />} />
        </Route>

        {/* Vigilante admin portal routes */}
        <Route path="/admin/vigilante" element={<VigilanteLayout />}>
          <Route index element={<VigilantePortal />} />
          <Route path="inbox" element={<VigilanteComplaintInbox />} />
          <Route path="complaint/:id" element={<VigilanteComplaintDetails />} />
          <Route path="analytics" element={<VigilanteAnalytics />} />
          <Route path="settings" element={<VigilanteSettings />} />
        </Route>

        {/* Road Safety Portal Routes */}
        <Route path="/admin/roadsafety" element={<RoadSafetyLayout />}>
          <Route index element={<RoadSafetyPortal />} />
          <Route path="dashboard" element={<RoadSafetyPortal />} />
          <Route path="inbox" element={<RoadSafetyComplaintInbox />} />
          <Route
            path="complaint/:id"
            element={<RoadSafetyComplaintDetails />}
          />
          <Route path="analytics" element={<RoadSafetyAnalytics />} />
          <Route path="settings" element={<RoadSafetySettings />} />
        </Route>

        {/* Fire Service Portal Routes */}
        <Route path="/admin/fireservice" element={<FireLayout />}>
          <Route index element={<FirePortal />} />
          <Route path="dashboard" element={<FirePortal />} />
          <Route path="inbox" element={<FireComplaintInbox />} />
          <Route path="complaint/:id" element={<FireComplaintDetails />} />
          <Route path="analytics" element={<FireAnalytics />} />
          <Route path="settings" element={<FireSettings />} />
        </Route>

        {/* Immigration portal Routes */}
        <Route path="/admin/dss" element={<ImmigrationLayout />}>
          <Route index element={<ImmigrationLayout />} />
          <Route path="dashboard" element={<ImmigrationPortal />} />
          <Route path="inbox" element={<ImmigrationComplaintInbox />} />
          <Route
            path="complaint/:id"
            element={<ImmigrationComplaintDetails />}
          />
          <Route path="analytics" element={<ImmigrationAnalytics />} />
          <Route path="settings" element={<ImmigrationSettings />} />
        </Route>

        {/* EFCC Portal Routes */}
        <Route path="/admin/efcc" element={<EfccLayout />}>
          <Route index element={<EfccPortal />} />
          <Route path="dashboard" element={<EfccPortal />} />
          <Route path="inbox" element={<EfccComplaintInbox />} />
          <Route path="complaint/:id" element={<EfccComplaintDetails />} />
          <Route path="analytics" element={<EfccAnalytics />} />
          <Route path="settings" element={<EfccSettings />} />
        </Route>

        {/* Fallback route */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen bg-gray-100">
              <h1 className="text-4xl font-bold text-black-600">
                Admin Panel is Live 🎉
              </h1>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
