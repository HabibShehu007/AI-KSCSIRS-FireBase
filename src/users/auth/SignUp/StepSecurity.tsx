type Props = {
  form: {
    password: string;
    confirmPassword: string;
    terms: boolean;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function StepSecurity({ form, handleChange }: Props) {
  const inputClass =
    "peer w-full border border-gray-300 px-4 pt-5 pb-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 relative";
  const labelClass =
    "absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500";

  return (
    <div className="space-y-6">
      {(["password", "confirmPassword"] as const).map((name) => {
        const label = name === "password" ? "Password" : "Confirm Password";
        return (
          <div key={name} className="relative">
            <input
              id={name}
              name={name}
              type="password"
              value={form[name]}
              onChange={handleChange}
              placeholder=" "
              className={inputClass}
              required
            />
            <label htmlFor={name} className={labelClass}>
              {label}
            </label>
          </div>
        );
      })}

      <label className="flex items-center space-x-2 text-sm">
        <input
          type="checkbox"
          name="terms"
          checked={form.terms}
          onChange={handleChange}
          className="accent-blue-600"
        />
        <span>I agree to the terms and conditions</span>
      </label>
    </div>
  );
}
