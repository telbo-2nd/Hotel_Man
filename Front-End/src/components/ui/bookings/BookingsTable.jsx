import { Eye, MoreVertical, Plus, CalendarCheck } from "lucide-react";
import Badge      from "../Badge";
import Button     from "../Button";
import EmptyState from "../EmptyState";
import Spinner    from "../Spinner";
import Pagination from "../Pagination";
import { formatDate }      from "../../../utils/formatDate";
import { formatCurrency }  from "../../../utils/formatCurrency";

export default function BookingsTable({
    data,
    isLoading,
    page,
    openMenu,
    onPageChange,
    onOpenMenu,
    onView,
    onNewBooking,
    onDeleteClick,
}) {
    if (isLoading) return <div className="bg-white rounded-xl border border-gray-100 overflow-hidden"><Spinner /></div>;

    if (!data?.bookings?.length) {
        return (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <EmptyState
                    icon={CalendarCheck}
                    title="No bookings found"
                    description="Create your first booking to get started"
                    action={<Button icon={Plus} onClick={onNewBooking}>New Booking</Button>}
                />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        {["Guest Name", "Room", "Check-in", "Check-out", "Nights", "Total Price", "Status", ""].map((h) => (
                            <th key={h} className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-5 py-3.5">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {data.bookings.map((booking) => {
                        const nights = Math.ceil(
                            (new Date(booking.checkOutDate) - new Date(booking.checkInDate))
                            / (1000 * 60 * 60 * 24)
                        );
                        const isCancelled = booking.status === "cancelled";

                        return (
                            <tr
                                key={booking.id}
                                className={`hover:bg-gray-50 transition-colors ${isCancelled ? "opacity-60" : ""}`}
                            >
                                {/* Guest */}
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-[#1a3a6e] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                            {booking.Guest?.Firstname?.[0]}{booking.Guest?.Lastname?.[0]}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                {booking.Guest?.Firstname} {booking.Guest?.Lastname}
                                            </p>
                                            <p className="text-xs text-gray-400">{booking.Guest?.email}</p>
                                        </div>
                                    </div>
                                </td>

                                {/* Room */}
                                <td className="px-5 py-4">
                                    <p className="font-medium text-gray-800">Room {booking.Room?.roomNumber}</p>
                                    <p className="text-xs text-gray-400">{booking.Room?.RoomType?.name}</p>
                                </td>

                                <td className="px-5 py-4 text-gray-600">{formatDate(booking.checkInDate)}</td>
                                <td className="px-5 py-4 text-gray-600">{formatDate(booking.checkOutDate)}</td>

                                {/* Nights */}
                                <td className="px-5 py-4">
                                    <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
                                        {nights}
                                    </span>
                                </td>

                                {/* Price */}
                                <td className="px-5 py-4 font-semibold text-[#1a3a6e]">
                                    {isCancelled
                                        ? <span className="line-through text-gray-400">{formatCurrency(booking.totalPrice)}</span>
                                        : formatCurrency(booking.totalPrice)
                                    }
                                </td>

                                <td className="px-5 py-4"><Badge status={booking.status} /></td>

                                {/* Actions */}
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-1 relative">
                                        <button
                                            onClick={() => onView(booking.id)}
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-[#1a3a6e] hover:bg-blue-50 transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onOpenMenu(openMenu === booking.id ? null : booking.id)}
                                            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                        {openMenu === booking.id && (
                                            <div className="absolute right-0 top-8 bg-white border border-gray-100 rounded-lg shadow-lg z-10 w-36 overflow-hidden">
                                                <button
                                                    onClick={() => { onView(booking.id); onOpenMenu(null); }}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                >
                                                    <Eye className="w-3.5 h-3.5" /> View Details
                                                </button>
                                                {isCancelled && (
                                                    <button
                                                        onClick={() => { onDeleteClick(booking); onOpenMenu(null); }}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="px-5 border-t border-gray-100">
                <div className="flex items-center justify-between py-3">
                    <p className="text-sm text-gray-500">
                        Showing <span className="font-medium">{data.bookings.length}</span> of{" "}
                        <span className="font-medium">{data.total}</span> bookings
                    </p>
                    <Pagination
                        page={page}
                        totalPages={data.totalPages || 1}
                        onPageChange={onPageChange}
                    />
                </div>
            </div>
        </div>
    );
}