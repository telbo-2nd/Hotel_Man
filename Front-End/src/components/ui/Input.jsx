export default function Input({
    label,
    name,
    type = "text",
    placeholder,
    register,
    error,
    required = false,
    className = "",
    ...rest
}) {
    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-all
                    ${error
                        ? "border-red-400 focus:ring-2 focus:ring-red-200"
                        : "border-gray-300 focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100"
                    } ${className}`}
                {...(register ? register(name) : {})}
                {...rest}
            />
            {error && (
                <p className="text-xs text-red-500">{error.message}</p>
            )}
        </div>
    );
}