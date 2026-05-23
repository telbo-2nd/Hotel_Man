import { Search } from "lucide-react";

export default function GuestsSearch({ searchTerm, onSearch }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search guests, emails, or national ID..."
                    value={searchTerm}
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100 transition-all"
                />
            </div>
        </div>
    );
}