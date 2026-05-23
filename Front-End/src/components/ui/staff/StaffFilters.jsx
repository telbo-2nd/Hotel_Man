import { Search } from "lucide-react";

export default function StaffFilters({ searchTerm, setSearchTerm, roleFilter, setRoleFilter, setPage }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search staff members..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100 transition-all"
                />
            </div>
            <select
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#1a3a6e] transition-all bg-white"
            >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="receptionist">Receptionist</option>
            </select>
        </div>
    );
}