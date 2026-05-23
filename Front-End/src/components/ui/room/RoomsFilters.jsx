import { Search } from "lucide-react";

const STATUS_OPTIONS = ["", "available", "occupied", "maintenance"];
const FLOOR_OPTIONS  = [1, 2, 3, 4, 5];

export default function RoomsFilters({ searchTerm, statusFilter, floorFilter, onSearch, onStatusChange, onFloorChange }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex flex-wrap items-center gap-3">

                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by room number..."
                        value={searchTerm}
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    {STATUS_OPTIONS.map((s) => (
                        <button
                            key={s}
                            onClick={() => onStatusChange(s)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all
                                ${statusFilter === s
                                    ? "bg-white text-[#1a3a6e] shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {s === "" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>

                <select
                    value={floorFilter}
                    onChange={(e) => onFloorChange(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#1a3a6e] bg-white"
                >
                    <option value="">All Floors</option>
                    {FLOOR_OPTIONS.map((f) => (
                        <option key={f} value={f}>Floor {f}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}