import Badge   from "../Badge";
import Spinner from "../Spinner";
import { formatDate }     from "../../../utils/formatDate";
import { formatCurrency } from "../../../utils/formatCurrency";

const STATUS_LINE_COLORS = {
    "checked-in":  "bg-green-500",
    "confirmed":   "bg-blue-500",
    "pending":     "bg-yellow-500",
    "checked-out": "bg-gray-400",
    "cancelled":   "bg-red-500",
};

export default function GuestBookingHistory({ bookings, isLoading, onBookingClick }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-800">Booking History</h3>
            </div>

            {isLoading ? (
                <Spinner />
            ) : bookings.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-10">
                    This guest has no bookings yet
                </p>
            ) : (
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            {["Room", "Check-in", "Check-out", "Nights", "Total", "Status"].map((h) => (
                                <th key={h} className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-5 py-3">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {bookings.map((booking) => {
                            const nights    = Math.ceil((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24));
                            const lineColor = STATUS_LINE_COLORS[booking.status] || "bg-gray-300";
                            return (
                                <tr
                                    key={booking.id}
                                    onClick={() => onBookingClick(booking.id)}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-1 h-10 rounded-full flex-shrink-0 ${lineColor}`} />
                                            <div>
                                                <p className="font-medium text-gray-800">Room {booking.Room?.roomNumber}</p>
                                                <p className="text-xs text-gray-400">{booking.Room?.RoomType?.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-600">{formatDate(booking.checkInDate)}</td>
                                    <td className="px-5 py-3.5 text-gray-600">{formatDate(booking.checkOutDate)}</td>
                                    <td className="px-5 py-3.5 text-gray-600">{nights}</td>
                                    <td className="px-5 py-3.5 font-semibold text-gray-800">{formatCurrency(booking.totalPrice)}</td>
                                    <td className="px-5 py-3.5"><Badge status={booking.status} /></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}