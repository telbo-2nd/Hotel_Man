import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    LayoutDashboard, Users, BedDouble, Tag,
    ConciergeBell, CalendarCheck, UserCog,
    Settings, LogOut, Hotel,
} from "lucide-react";
import { User } from "lucide-react";

// nav items by role
const adminNav = [
    { label: "Dashboard",   path: "/dashboard/admin",        icon: LayoutDashboard },
    { label: "Guests",      path: "/guests",                  icon: Users },
    { label: "Rooms",       path: "/rooms",                   icon: BedDouble },
    { label: "Room Types",  path: "/room-types",              icon: Tag },
    { label: "Services",    path: "/services",                icon: ConciergeBell },
    { label: "Bookings",    path: "/bookings",                icon: CalendarCheck },
    { label: "Staff",       path: "/staff",                   icon: UserCog },
    { label: "My Profile", path: "/profile", icon: User },
];

const receptionistNav = [
    { label: "Dashboard",       path: "/dashboard/receptionist", icon: LayoutDashboard },
    { label: "Guests",          path: "/guests",                  icon: Users },
    { label: "Available Rooms", path: "/available-rooms",         icon: BedDouble },
    { label: "Bookings",        path: "/bookings",                icon: CalendarCheck },
    { label: "My Profile", path: "/profile", icon: User },
];

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const navItems = user?.role === "admin" ? adminNav : receptionistNav;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // get initials for avatar
    const initials = user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <aside className="fixed left-0 top-0 h-screen w-56 bg-white border-r border-gray-100 flex flex-col z-30">

            {/* logo */}
            <div className="px-5 py-5 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                    <div className="bg-[#1a3a6e] p-2 rounded-lg">
                        <Hotel className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-[#1a3a6e] leading-tight">GrandStay Pro</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                            {user?.role === "admin" ? "Admin Portal" : "Reception Desk"}
                        </p>
                    </div>
                </div>
            </div>

            {/* nav links */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto">
                <ul className="space-y-0.5">
                    {navItems.map(({ label, path, icon: Icon }) => (
                        <li key={path}>
                            <NavLink
                                to={path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                                    ${isActive
                                        ? "bg-[#1a3a6e] text-white"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-[#1a3a6e]"
                                    }`
                                }
                            >
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                {label}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* admin only — settings at bottom of nav */}
                {user?.role === "admin" && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide px-3 mb-2">
                            Preferences
                        </p>
                        <NavLink
                            to="/hotel-config"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                                ${isActive
                                    ? "bg-[#1a3a6e] text-white"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-[#1a3a6e]"
                                }`
                            }
                        >
                            <Settings className="w-4 h-4" />
                            System Settings
                        </NavLink>
                    </div>
                )}
            </nav>

            {/* user info + logout */}
            <div className="px-3 py-4 border-t border-gray-100">
                <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-[#1a3a6e] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="mt-2 w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </aside>
    );
}