const STATUS_TABS = ["all", "pending", "confirmed", "checked-in", "checked-out", "cancelled"];

export default function BookingStatusTabs({ status, onStatusChange }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-1 flex items-center gap-1 overflow-x-auto">
            {STATUS_TABS.map((s) => (
                <button
                    key={s}
                    onClick={() => onStatusChange(s)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-all
                        ${status === s
                            ? "bg-[#1a3a6e] text-white"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        }`}
                >
                    {s === "all" ? "All" : s}
                </button>
            ))}
        </div>
    );
}
