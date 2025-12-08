import { FiMail, FiLock } from "react-icons/fi";

export default function CentralLoginForm({
  email,
  password,
  setEmail,
  setPassword,
}: {
  email: string;
  password: string;
  setEmail: (val: string) => void;
  setPassword: (val: string) => void;
}) {
  return (
    <>
      {/* Email */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <FiMail className="absolute top-9 left-3 text-gray-400" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 pl-10 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a1f44]"
          required
        />
      </div>

      {/* Password */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <FiLock className="absolute top-9 left-3 text-gray-400" />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 pl-10 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a1f44]"
          required
        />
      </div>
    </>
  );
}
