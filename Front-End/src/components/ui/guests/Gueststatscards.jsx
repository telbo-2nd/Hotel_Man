import { CreditCard } from "lucide-react";
import { formatCurrency } from "../../../utils/formatCurrency";

export default function GuestStatsCards({ totalBookings, totalSpent }) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                    <CreditCard className="w-5 h-5 text-[#1a3a6e]" />
                </div>
                <div>
                    <p className="text-xs text-gray-400">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
                </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
                <div className="bg-green-50 p-3 rounded-lg">
                    <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div>
                    <p className="text-xs text-gray-400">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
                </div>
            </div>
        </div>
    );
}