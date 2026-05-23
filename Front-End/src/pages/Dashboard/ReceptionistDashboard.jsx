import { BedDouble, LogIn, LogOut, Clock } from "lucide-react";
import { useReceptionistDashboard } from "../../hooks/useDashboard";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";

export default function ReceptionistDashboard() {
    const { data, isLoading, error } = useReceptionistDashboard();

    if (isLoading) return <Spinner />;
    if (error) return (
        <div className="text-center py-20 text-red-500">
            Failed to load dashboard data
        </div>
    );

    return (
        <div className="space-y-6">

            {/* page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reception Overview</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {data.today} — Here's what's happening today
                    </p>
                </div>
            </div>

            {/* stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    title="Available Rooms"
                    value={data.availableRooms}
                    subtitle="Ready for check-in"
                    icon={BedDouble}
                    color="blue"
                />
                <StatCard
                    title="Today's Check-ins"
                    value={data.checkIns.count}
                    subtitle="Arriving today"
                    icon={LogIn}
                    color="green"
                />
                <StatCard
                    title="Today's Check-outs"
                    value={data.checkOuts.count}
                    subtitle="Departing today"
                    icon={LogOut}
                    color="yellow"
                />
            </div>

            {/* today's arrivals + departures */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

                {/* today's arrivals */}
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <LogIn className="w-4 h-4 text-green-600" />
                            <h2 className="text-base font-semibold text-gray-800">
                                Today's Arrivals
                            </h2>
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                            {data.checkIns.count} Guests
                        </span>
                    </div>

                    {data.checkIns.bookings.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">
                            No check-ins today
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide pb-3">Guest</th>
                                        <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide pb-3">Room</th>
                                        <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide pb-3">Services</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {data.checkIns.bookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-3">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-full bg-[#1a3a6e] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                        {booking.Guest?.Firstname?.[0]}{booking.Guest?.Lastname?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">
                                                            {booking.Guest?.Firstname} {booking.Guest?.Lastname}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {booking.Guest?.phone}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <p className="font-medium text-[#1a3a6e]">
                                                    Room {booking.Room?.roomNumber}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {booking.Room?.RoomType?.name}
                                                </p>
                                            </td>
                                            <td className="py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {booking.Services?.length > 0
                                                        ? booking.Services.map((s) => (
                                                            <span key={s.id} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                                                                {s.name}
                                                            </span>
                                                        ))
                                                        : <span className="text-xs text-gray-400">None</span>
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* today's departures */}
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <LogOut className="w-4 h-4 text-yellow-600" />
                            <h2 className="text-base font-semibold text-gray-800">
                                Today's Departures
                            </h2>
                        </div>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full font-medium">
                            {data.checkOuts.count} Rooms
                        </span>
                    </div>

                    {data.checkOuts.bookings.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">
                            No check-outs today
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide pb-3">Guest</th>
                                        <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide pb-3">Room</th>
                                        <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wide pb-3">Bill</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {data.checkOuts.bookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-3">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                        {booking.Guest?.Firstname?.[0]}{booking.Guest?.Lastname?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">
                                                            {booking.Guest?.Firstname} {booking.Guest?.Lastname}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {booking.Guest?.phone}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <p className="font-medium text-[#1a3a6e]">
                                                    Room {booking.Room?.roomNumber}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {booking.Room?.RoomType?.name}
                                                </p>
                                            </td>
                                            <td className="py-3 text-right">
                                                <p className="font-semibold text-gray-800">
                                                    {formatCurrency(booking.totalPrice)}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* pending bookings + occupied rooms */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

                {/* pending bookings */}
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-yellow-500" />
                            <h2 className="text-base font-semibold text-gray-800">
                                Pending Bookings
                            </h2>
                        </div>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full font-medium">
                            {data.pendingBookings.count}
                        </span>
                    </div>

                    {data.pendingBookings.bookings.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">
                            No pending bookings
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {data.pendingBookings.bookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all"
                                >
                                    <div>
                                        <p className="font-medium text-gray-800 text-sm">
                                            {booking.Guest?.Firstname} {booking.Guest?.Lastname}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Room {booking.Room?.roomNumber} · {booking.Room?.RoomType?.name}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-[#1a3a6e]">
                                            {formatDate(booking.checkInDate)}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            → {formatDate(booking.checkOutDate)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* currently occupied rooms */}
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <BedDouble className="w-4 h-4 text-[#1a3a6e]" />
                            <h2 className="text-base font-semibold text-gray-800">
                                Current Occupancy
                            </h2>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-[#1a3a6e] inline-block" />
                                Occupied
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                                Maint.
                            </span>
                        </div>
                    </div>

                    {data.occupiedRooms.bookings.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">
                            No occupied rooms
                        </p>
                    ) : (
                        <div className="grid grid-cols-3 gap-2">
                            {data.occupiedRooms.bookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="border-t-2 border-[#1a3a6e] bg-gray-50 rounded-lg p-3"
                                >
                                    <p className="font-bold text-gray-800 text-sm">
                                        {booking.Room?.roomNumber}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1 truncate">
                                        {booking.Guest?.Firstname} {booking.Guest?.Lastname}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Out {formatDate(booking.checkOutDate)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}