import { Bell, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
    const { user } = useAuth();

    return (
        <header className="fixed top-0 left-56 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-20">

            {/* search bar */}
            <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Quick search guests, rooms..."
                    className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100 transition-all"
                />
            </div>

            {/* right side */}
            <div className="flex items-center gap-4">
                {/* notifications */}
                <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* user info */}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#1a3a6e] flex items-center justify-center text-white text-sm font-bold">
                        {user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                </div>
            </div>
        </header>
    );
}