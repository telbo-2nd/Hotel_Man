import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,Cell  } from "recharts";
import { DollarSign, Users, BedDouble, TrendingUp, Star, ConciergeBell } from "lucide-react";
import { useAdminDashboard } from "../../hooks/useDashboard";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

export default function AdminDashboard() {
    const { data, isLoading, error } = useAdminDashboard();

    if (isLoading) return <Spinner />;
    if (error) return (
        <div className="text-center py-20 text-red-500">
            Failed to load dashboard data
        </div>
    );
    console.log(data.revenueByMonth);
    const BAR_COLORS = ["#6366f1", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#1a3a6e"];

    return (
        <div className="space-y-6">

            {/* page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Operational Intelligence</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Monitoring real-time property performance
                    </p>
                </div>
            </div>

            {/* stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(data.revenue.allTime)}
                    subtitle="All time"
                    icon={DollarSign}
                    color="blue"
                />
                <StatCard
                    title="This Month"
                    value={formatCurrency(data.revenue.thisMonth)}
                    subtitle="Current month revenue"
                    icon={TrendingUp}
                    color="green"
                />
                
                <StatCard
                    title="Total Guests"
                    value={data.guests.total}
                    subtitle="Registered guests"
                    icon={Users}
                    color="yellow"
                />
                <StatCard
                    title="Occupancy Rate"
                    value={data.rooms.occupancyRate}
                    subtitle={`${data.rooms.total} total rooms`}
                    icon={BedDouble}
                    color="red"
                />
            </div>

            {/* revenue chart + highlights */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

                {/* revenue chart */}
                <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
                    <h2 className="text-base font-semibold text-gray-800 mb-1">
                        Revenue Performance
                    </h2>
                    <p className="text-xs text-gray-400 mb-5">
                        Comparative analysis of monthly bookings
                    </p>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={data.revenueByMonth} barSize={32}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 12, fill: "#94a3b8" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: "#94a3b8" }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => `$${v}`}
                            />
                            <Tooltip
                                formatter={(value) => [formatCurrency(value), "Revenue"]}
                                contentStyle={{
                                    borderRadius: "8px",
                                    border: "1px solid #e2e8f0",
                                    fontSize: "13px",
                                }}
                            />
                            
                            <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                                {data.revenueByMonth.map((_, index) => (
                                    <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* highlights */}
                <div className="space-y-4">

                    {/* most booked room type */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
                            Best Performer
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-50 p-2.5 rounded-lg">
                                <Star className="w-5 h-5 text-[#1a3a6e]" />
                            </div>
                            <div>
                                <p className="text-base font-bold text-gray-800">
                                    {data.mostBookedRoomType?.name || "N/A"}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {data.mostBookedRoomType?.bookingCount || 0} bookings
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* most requested service */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
                            Trending Service
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="bg-green-50 p-2.5 rounded-lg">
                                <ConciergeBell className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-base font-bold text-gray-800">
                                    {data.mostRequestedService?.name || "N/A"}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {data.mostRequestedService?.totalQuantity || 0} requests
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* rooms by status */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
                            Room Status
                        </p>
                        <div className="space-y-2">
                            {data.rooms.byStatus.map((r) => (
                                <div key={r.status} className="flex items-center justify-between">
                                    <Badge status={r.status} />
                                    <span className="text-sm font-semibold text-gray-700">
                                        {r.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* bookings by status */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h2 className="text-base font-semibold text-gray-800 mb-4">
                    Reservation Logistics
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {data.bookings.byStatus.map((b) => (
                        <div
                            key={b.status}
                            className="border border-gray-100 rounded-lg p-4 text-center"
                        >
                            <p className="text-2xl font-bold text-gray-900">{b.count}</p>
                            <Badge status={b.status} />
                        </div>
                    ))}
                </div>
            </div>

            {/* recent bookings */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-base font-semibold text-gray-800">
                            Recent Booking Log
                        </h2>
                        <p className="text-xs text-gray-400">
                            Detailed overview of latest guest interactions
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide pb-3">
                                    Guest
                                </th>
                                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide pb-3">
                                    Room
                                </th>
                                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide pb-3">
                                    Stay Duration
                                </th>
                                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide pb-3">
                                    Status
                                </th>
                                <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wide pb-3">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {data.recentBookings.map((booking) => {
                                const initials = `${booking.Guest?.Firstname?.[0] || ""}${booking.Guest?.Lastname?.[0] || ""}`;
                                return (
                                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#1a3a6e] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                    {initials.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {booking.Guest?.Firstname} {booking.Guest?.Lastname}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {booking.Guest?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5">
                                            <p className="font-medium text-gray-800">
                                                Room {booking.Room?.roomNumber}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {booking.Room?.RoomType?.name}
                                            </p>
                                        </td>
                                        <td className="py-3.5">
                                            <p className="text-gray-700">
                                                {formatDate(booking.checkInDate)} — {formatDate(booking.checkOutDate)}
                                            </p>
                                        </td>
                                        <td className="py-3.5">
                                            <Badge status={booking.status} />
                                        </td>
                                        <td className="py-3.5 text-right font-semibold text-gray-800">
                                            {formatCurrency(booking.totalPrice)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}