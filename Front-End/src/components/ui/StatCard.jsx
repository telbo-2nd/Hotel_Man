export default function StatCard({ title, value, subtitle, icon: Icon, color = "blue", trend }) {
    const colors = {
        blue:   { bg: "bg-blue-50",   icon: "text-[#1a3a6e]",  border: "border-blue-100" },
        green:  { bg: "bg-green-50",  icon: "text-green-600",  border: "border-green-100" },
        yellow: { bg: "bg-yellow-50", icon: "text-yellow-600", border: "border-yellow-100" },
        red:    { bg: "bg-red-50",    icon: "text-red-600",    border: "border-red-100" },
    };

    const c = colors[color] || colors.blue;

    return (
        <div className={`bg-white rounded-xl border ${c.border} p-5 flex items-start gap-4`}>
            <div className={`${c.bg} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${c.icon}`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                {subtitle && (
                    <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
                )}
                {trend && (
                    <p className={`text-xs font-medium mt-1 ${trend > 0 ? "text-green-600" : "text-red-500"}`}>
                        {trend > 0 ? "▲" : "▼"} {Math.abs(trend)}%
                    </p>
                )}
            </div>
        </div>
    );
}