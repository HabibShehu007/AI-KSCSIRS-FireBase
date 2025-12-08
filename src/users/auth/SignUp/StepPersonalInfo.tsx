import NINValidator from "./NINValidator";

type Props = {
  form: {
    name: string;
    phone: string;
    email: string;
    nin: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValidated: () => void;
  isValidated: boolean;
};

export default function StepPersonalInfo({
  form,
  handleChange,
  onValidated,
  isValidated,
}: Props) {
  const inputClass =
    "peer w-full border border-gray-300 px-4 pt-5 pb-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200";
  const labelClass =
    "absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500";

  const fields = [
    { name: "name", type: "text", label: "Full Name" },
    { name: "phone", type: "text", label: "Phone Number" },
    { name: "email", type: "email", label: "Email Address" },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Input Fields */}
      {fields.map(({ name, type, label }) => (
        <div key={name} className="relative">
          <div className="absolute left-3 top-3 text-gray-400"></div>
          <input
            id={name}
            name={name}
            type={type}
            value={form[name]}
            onChange={handleChange}
            placeholder=" "
            className={`${inputClass} pl-10`}
            required
          />
          <label htmlFor={name} className={labelClass}>
            {label}
          </label>
        </div>
      ))}

      {/* NIN Validator */}
      <NINValidator
        nin={form.nin}
        onChange={handleChange}
        onValidated={onValidated}
        isValidated={isValidated}
      />
    </div>
  );
}
