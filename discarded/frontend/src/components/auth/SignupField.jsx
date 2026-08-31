// SignupField.jsx
export default function SignupField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  pattern,
  error,
  isChecking,
  transform,
  isSelect = false,
  options = [],
  required = false
}) {
  const handleChange = (e) => {
    let val = e.target.value;
    if (transform === 'uppercase') {
      val = val.toUpperCase();
    } else if (transform === 'capitalize') {
      val = val.replace(/\b\w/g, c => c.toUpperCase());
    }
    onChange({ target: { name, value: val } });
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {isSelect ? (
          <select
            name={name}
            value={value}
            onChange={handleChange}
            {...(required && { required: true })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          >
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            name={name}
            type={type}
            value={value}
            onChange={handleChange}
            pattern={pattern}
            {...(required && { required: true })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 dark:text-white ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            autoComplete="off"
          />
        )}
        {isChecking && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
