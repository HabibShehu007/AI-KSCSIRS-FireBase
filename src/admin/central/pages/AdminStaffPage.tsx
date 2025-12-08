import { useEffect, useState } from "react";
import axios from "axios";
import { FiPlus } from "react-icons/fi";
import StaffTable from "../components/StaffTable";
import StaffForm from "../components/StaffForm";
import StaffModal from "../components/StaffModal";
import type { Staff } from "../../../types/StaffTypes";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

export default function AdminStaffPage() {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const [formData, setFormData] = useState<Omit<Staff, "id" | "createdAt">>({
    department_email: "",
    staff_email: "",
    password: "",
    department: "",
  });

  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = async () => {
    try {
      const res = await axios.get("http://localhost:3000/admin/staff");
      setStaffs(res.data);
    } catch {
      console.error("❌ Failed to load staff");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/admin/staff", formData);
      setShowForm(false);
      setFormData({
        department_email: "",
        staff_email: "",
        password: "",
        department: "",
      });
      fetchStaffs();
    } catch {
      console.error("❌ Failed to add staff");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;
    try {
      await axios.put(
        `http://localhost:3000/admin/staff/${selectedStaff.id}`,
        formData
      );
      setShowEdit(false);
      setSelectedStaff(null);
      fetchStaffs();
    } catch {
      console.error("❌ Failed to update staff");
    }
  };

  const handleDelete = async () => {
    if (!selectedStaff) return;
    try {
      await axios.delete(
        `http://localhost:3000/admin/staff/${selectedStaff.id}`
      );
      setShowDelete(false);
      setSelectedStaff(null);
      fetchStaffs();
    } catch {
      console.error("❌ Failed to delete staff");
    }
  };

  return (
    <div className="p-6 bg-[#f5f7fa] min-h-screen">
      <h1 className="text-3xl font-bold text-[#0a1f44] mb-6 text-center">
        👥 Staff Management
      </h1>

      <StaffTable
        staffs={staffs}
        onView={(staff) => {
          setSelectedStaff(staff);
          setShowView(true);
        }}
        onEdit={(staff) => {
          setSelectedStaff(staff);
          setFormData({
            department_email: staff.department_email,
            staff_email: staff.staff_email,
            password: staff.password ?? "", // if password is not returned, leave blank
            department: staff.department,
          });
          setShowEdit(true);
        }}
        onDelete={(staff) => {
          setSelectedStaff(staff);
          setShowDelete(true);
        }}
      />

      {/* Floating Add Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <FiPlus className="text-2xl" />
      </button>

      {/* Add Staff Modal */}
      {showForm && (
        <StaffModal title="➕ Add Staff" onClose={() => setShowForm(false)}>
          <StaffForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
          />
        </StaffModal>
      )}

      {/* View Staff Modal */}
      {showView && selectedStaff && (
        <StaffModal onClose={() => setShowView(false)}>
          <div className="flex flex-col items-center space-y-4">
            {/* Centered Icon */}
            <FiEye className="text-blue-600 text-4xl" />
            <h2 className="text-xl font-bold text-[#0a1f44]">View Staff</h2>

            {/* Staff Details */}
            <div className="space-y-3 text-center">
              <p>
                <strong>Department Email:</strong>{" "}
                {selectedStaff.department_email}
              </p>
              <p>
                <strong>Staff Email:</strong> {selectedStaff.staff_email}
              </p>
              <p>
                <strong>Department:</strong> {selectedStaff.department}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(selectedStaff.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </StaffModal>
      )}

      {/* Edit Staff Modal */}
      {showEdit && selectedStaff && (
        <StaffModal onClose={() => setShowEdit(false)}>
          <div className="flex flex-col items-center space-y-4">
            <FiEdit className="text-green-600 text-4xl" />
            <h2 className="text-xl font-bold text-[#0a1f44]">Edit Staff</h2>

            <StaffForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleEditSubmit}
            />
          </div>
        </StaffModal>
      )}

      {/* Delete Confirmation Modal */}
      {showDelete && selectedStaff && (
        <StaffModal onClose={() => setShowDelete(false)}>
          <div className="flex flex-col items-center space-y-4">
            <FiTrash2 className="text-red-600 text-4xl" />
            <h2 className="text-xl font-bold text-[#0a1f44]">Delete Staff</h2>

            <p className="text-red-600 font-semibold text-center">
              Are you sure you want to delete staff{" "}
              <strong>{selectedStaff.staff_email}</strong>?
            </p>

            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </StaffModal>
      )}
    </div>
  );
}
