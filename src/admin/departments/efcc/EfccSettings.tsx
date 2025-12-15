import {
  FiUser,
  FiBell,
  FiLock,
  FiSettings,
  FiChevronRight,
} from "react-icons/fi";

export default function EfccSettings() {
  return (
    <div className="p-8 space-y-10">
      <h2 className="text-3xl font-bold text-[#0a1f44]">EFCC Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FiUser className="text-3xl text-blue-700" />
            <div>
              <h3 className="text-lg font-semibold">Profile</h3>
              <p className="text-sm text-gray-600">Manage your account info</p>
            </div>
          </div>
          <FiChevronRight className="text-gray-400 text-xl" />
        </div>

        {/* Notification Settings */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FiBell className="text-3xl text-yellow-500" />
            <div>
              <h3 className="text-lg font-semibold">Notifications</h3>
              <p className="text-sm text-gray-600">
                Alert preferences & sounds
              </p>
            </div>
          </div>
          <FiChevronRight className="text-gray-400 text-xl" />
        </div>

        {/* Security Settings */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FiLock className="text-3xl text-red-600" />
            <div>
              <h3 className="text-lg font-semibold">Security</h3>
              <p className="text-sm text-gray-600">Password & access control</p>
            </div>
          </div>
          <FiChevronRight className="text-gray-400 text-xl" />
        </div>

        {/* System Settings */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FiSettings className="text-3xl text-gray-700" />
            <div>
              <h3 className="text-lg font-semibold">System</h3>
              <p className="text-sm text-gray-600">
                App behavior & preferences
              </p>
            </div>
          </div>
          <FiChevronRight className="text-gray-400 text-xl" />
        </div>
      </div>
    </div>
  );
}
