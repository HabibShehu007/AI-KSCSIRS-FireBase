import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiEye,
  FiTrash,
  FiUserMinus,
  FiPhone,
  FiMapPin,
  FiFlag,
  FiMap,
  FiCalendar,
  FiLock,
  FiX,
  FiCheckCircle,
  FiUser,
} from "react-icons/fi"; // swapped icons for more engaging look
import ConfirmModal from "./ConfirmModal";
import type { User } from "../../../types/UserTypes"; // ✅ import User type from your shared file

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get("http://localhost:3000/admin/users")
      .then((res) => setUsers(res.data))
      .catch(() => alert("Failed to load users"))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id: number) => {
    setConfirmDeleteId(id); // open modal instead of window.confirm
  };

  const confirmDelete = async () => {
    if (confirmDeleteId === null) return;
    try {
      await axios.delete(
        `http://localhost:3000/admin/users/${confirmDeleteId}`
      );
      setUsers(users.filter((u) => u.id !== confirmDeleteId));
    } catch {
      alert("Failed to delete user");
    } finally {
      setConfirmDeleteId(null); // close modal
    }
  };

  const handleBlock = async (id: number) => {
    alert(`🚫 Block user with ID ${id} (implement backend logic here)`);
  };

  const handleView = async (user: User) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/admin/users/${user.id}`
      );
      setSelectedUser(res.data); // ✅ now you’ll have phone, address, state, lga
    } catch {
      alert("Failed to load user details");
    }
  };

  return (
    <div className="p-6 bg-[#f5f7fa] min-h-screen">
      <h1 className="text-4xl font-extrabold text-[#0a1f44] mb-6 text-center tracking-wide">
        <FiUser className="text-8xl inline-block mr-3 text-blue-600" />
        Registered Users
      </h1>

      {loading ? (
        <p className="text-lg text-gray-600 text-center font-semibold">
          Loading users...
        </p>
      ) : (
        <div>
          {/* Total Users Count */}
          <div className="mb-4 text-center">
            <span className="text-2xl font-extrabold text-[#0a1f44]">
              Total Users: {users.length}
            </span>
          </div>

          <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
            <thead className="bg-[#0a1f44] text-white">
              <tr>
                <th className="p-4 text-left font-bold text-lg">#</th>
                <th className="p-4 text-left font-bold text-lg">Name</th>
                <th className="p-4 text-left font-bold text-lg">Email</th>
                <th className="p-4 text-left font-bold text-lg">Registered</th>
                <th className="p-4 text-left font-bold text-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* Bold numbering */}
                  <td className="p-4 font-extrabold text-[#0a1f44]">
                    {index + 1}
                  </td>
                  <td className="p-4 font-semibold text-[#0a1f44]">
                    {user.name}
                  </td>
                  <td className="p-4 text-gray-700">{user.email}</td>
                  <td className="p-4 text-gray-600">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 flex gap-3">
                    <button
                      onClick={() => handleView(user)}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                    >
                      <FiEye className="text-lg" /> View
                    </button>
                    <button
                      onClick={() => handleBlock(user.id)}
                      className="flex items-center gap-2 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-semibold"
                    >
                      <FiUserMinus className="text-lg" /> Block
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                    >
                      <FiTrash className="text-lg" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-linear-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-10 w-lg border border-gray-200">
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center gap-3">
                <FiUserMinus className="text-blue-600 text-5xl" />
                <h2 className="text-3xl font-extrabold text-[#0a1f44] tracking-wide">
                  User Profile
                </h2>
              </div>
              <p className="mt-2 text-gray-600 font-medium">
                ID:{" "}
                <span className="font-bold text-gray-800">
                  {selectedUser.id}
                </span>
              </p>
            </div>

            {/* Details */}
            <div className="space-y-6 text-lg">
              <p className="flex items-center gap-3 font-semibold text-gray-800">
                <FiUserMinus className="text-blue-600 text-2xl" />
                <span className="text-[#0a1f44] font-bold">Name:</span>
                <span className="text-gray-900">{selectedUser.name}</span>
              </p>

              <p className="flex items-center gap-3 font-semibold text-gray-800">
                <FiEye className="text-green-600 text-2xl" />
                <span className="text-[#0a1f44] font-bold">Email:</span>
                <span className="text-gray-900">{selectedUser.email}</span>
              </p>

              {selectedUser.phone && (
                <p className="flex items-center gap-3 font-semibold text-gray-800">
                  <FiPhone className="text-purple-600 text-2xl" />
                  <span className="text-[#0a1f44] font-bold">Phone:</span>
                  <span className="text-gray-900">{selectedUser.phone}</span>
                </p>
              )}

              {selectedUser.address && (
                <p className="flex items-center gap-3 font-semibold text-gray-800">
                  <FiMapPin className="text-pink-600 text-2xl" />
                  <span className="text-[#0a1f44] font-bold">Address:</span>
                  <span className="text-gray-900">{selectedUser.address}</span>
                </p>
              )}

              {selectedUser.state && (
                <p className="flex items-center gap-3 font-semibold text-gray-800">
                  <FiFlag className="text-indigo-600 text-2xl" />
                  <span className="text-[#0a1f44] font-bold">State:</span>
                  <span className="text-gray-900">{selectedUser.state}</span>
                </p>
              )}

              {selectedUser.lga && (
                <p className="flex items-center gap-3 font-semibold text-gray-800">
                  <FiMap className="text-orange-600 text-2xl" />
                  <span className="text-[#0a1f44] font-bold">LGA:</span>
                  <span className="text-gray-900">{selectedUser.lga}</span>
                </p>
              )}

              <p className="flex items-center gap-3 font-semibold text-gray-800">
                <FiCalendar className="text-teal-600 text-2xl" />
                <span className="text-[#0a1f44] font-bold">Registered:</span>
                <span className="text-gray-900">
                  {new Date(selectedUser.created_at).toLocaleString()}
                </span>
              </p>

              {selectedUser.terms_accepted !== undefined && (
                <p className="flex items-center gap-3 font-semibold text-gray-800">
                  <FiCheckCircle
                    className={`text-2xl ${
                      selectedUser.terms_accepted
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  />
                  <span className="text-[#0a1f44] font-bold">
                    Terms Accepted:
                  </span>
                  <span
                    className={`font-bold ${
                      selectedUser.terms_accepted
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {selectedUser.terms_accepted ? "Yes" : "No"}
                  </span>
                </p>
              )}

              <p className="flex items-center gap-3 font-semibold text-gray-800">
                <FiLock className="text-red-600 text-2xl" />
                <span className="text-[#0a1f44] font-bold">Password:</span>
                <span className="text-red-600 font-bold">🔒 Hidden</span>
              </p>
            </div>

            {/* Footer */}
            <button
              onClick={() => setSelectedUser(null)}
              className="mt-10 w-full px-5 py-3 bg-linear-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900 font-bold tracking-wide flex items-center justify-center gap-2 shadow-lg transition"
            >
              <FiX className="text-2xl" /> Close
            </button>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDeleteId !== null && (
        <ConfirmModal
          message="Are you sure you want to delete this user from your DataBase? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}
