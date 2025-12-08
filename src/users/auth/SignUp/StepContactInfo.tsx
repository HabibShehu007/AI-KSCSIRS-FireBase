import katsinaLGAs from "../../../data/katsinaLGAs";

type Props = {
  form: {
    address: string;
    state: string;
    lga: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
};

export default function StepContactInfo({ form, handleChange }: Props) {
  const inputClass =
    "peer w-full border border-gray-300 px-4 pt-5 pb-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 relative";
  const labelClass =
    "absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500";

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          id="address"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder=" "
          className={inputClass}
          required
        />
        <label htmlFor="address" className={labelClass}>
          Address
        </label>
      </div>

      <div className="relative">
        <select
          id="state"
          name="state"
          value={form.state}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select State</option>
          <option value="Katsina">Katsina</option>
          {/* Add more states as needed */}
        </select>
      </div>

      <div className="relative">
        <select
          id="lga"
          name="lga"
          value={form.lga}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Local Government</option>
          {katsinaLGAs.map((lga) => (
            <option key={lga} value={lga}>
              {lga}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
