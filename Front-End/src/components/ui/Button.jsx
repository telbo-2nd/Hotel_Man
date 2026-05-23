import { Loader2 } from "lucide-react";

export default function Button({
    children,
    onClick,
    type = "button",
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    className = "",
    icon: Icon,
}) {
    const base = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary:   "bg-[#1a3a6e] text-white hover:bg-[#162f58] active:bg-[#112444]",
        secondary: "bg-white text-[#1a3a6e] border border-[#1a3a6e] hover:bg-blue-50",
        danger:    "bg-white text-red-600 border border-red-300 hover:bg-red-50",
        ghost:     "bg-transparent text-gray-600 hover:bg-gray-100",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {loading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : Icon && <Icon className="w-4 h-4" />
            }
            {children}
        </button>
    );
}