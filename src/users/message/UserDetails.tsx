// src/message/UserDetails.tsx
import {
  FiUser,
  FiPhone,
  FiMail,
  FiList,
  FiEdit2,
  FiMapPin,
} from "react-icons/fi";

type Props = {
  user: string;
  phone: string;
  email: string;
  title: string;
  description: string;
  address: string;
  offenses: string[];
  onChange: (field: string, value: string) => void;
};

export default function UserDetails({
  user,
  phone,
  email,
  title,
  description,
  address,
  offenses,
  onChange,
}: Props) {
  console.log("👤 UserDetails loaded with:", {
    user,
    phone,
    email,
    title,
    description,
    address,
    offenses,
  }); // Debug log

  const labelClass =
    "text-sm font-semibold text-[#0a1f44] flex items-center gap-2 mb-2";
  const inputClass =
    "w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200";

  return (
    <div className="space-y-6">
      {/* Auto-filled User Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={labelClass}>
            <FiUser /> Full Name
          </label>
          <input
            type="text"
            value={user}
            readOnly
            placeholder="Auto-filled from signup"
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md border border-gray-300 shadow-sm cursor-not-allowed"
          />
        </div>
        <div>
          <label className={labelClass}>
            <FiPhone /> Phone
          </label>
          <input
            type="tel"
            value={phone}
            readOnly
            placeholder="Auto-filled from signup"
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md border border-gray-300 shadow-sm cursor-not-allowed"
          />
        </div>
        <div>
          <label className={labelClass}>
            <FiMail /> Email
          </label>
          <input
            type="email"
            value={email}
            readOnly
            placeholder="Auto-filled from signup"
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md border border-gray-300 shadow-sm cursor-not-allowed"
          />
        </div>
      </div>

      {/* Offense Type */}
      <div>
        <label className={labelClass}>
          <FiList /> Offense Type
        </label>
        <select
          value={title}
          onChange={(e) => {
            console.log("📋 Offense selected:", e.target.value); // Debug log
            onChange("title", e.target.value);
          }}
          className={`${inputClass} bg-white`}
          required
        >
          <option value="">Select an offense</option>
          {offenses.map((off, i) => (
            <option key={i} value={off}>
              {off}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>
          <FiEdit2 /> Description
        </label>
        <textarea
          value={description}
          onChange={(e) => {
            console.log("📝 Description updated"); // Debug log
            onChange("description", e.target.value);
          }}
          className={`${inputClass} resize-none`}
          rows={4}
          placeholder="Describe the incident clearly..."
          required
        />
      </div>

      {/* Location */}
      <div>
        <label className={labelClass}>
          <FiMapPin /> Location
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => {
            console.log("📍 Address updated"); // Debug log
            onChange("address", e.target.value);
          }}
          className={inputClass}
          placeholder="Enter address or location"
          required
        />
      </div>
    </div>
  );
}
