export default function Input({
  label,
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  error = '',
  className = '',
  icon: Icon = null,
  ...props
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            {Icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-2.5 ${Icon ? 'pl-10' : ''} bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white ${
            error ? 'border-red-500 focus:ring-red-500' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-600 text-xs font-medium mt-1.5">{error}</p>
      )}
    </div>
  );
}
