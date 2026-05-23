import Badge from "../Badge";
import { formatDate } from "../../../utils/formatDate";

export default function BookingInfoCard({ booking, nights }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Booking Information</h2>

            <div className="grid grid-cols-3 gap-4 mb-5">
                <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Reference ID</p>
                    <p className="text-sm font-mono font-semibold text-gray-800">
                        #{booking.id.slice(0, 8).toUpperCase()}
                    </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Stay Duration</p>
                    <p className="text-sm font-semibold text-gray-800">{nights} Nights</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Status</p>
                    <Badge status={booking.status} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-100 rounded-xl p-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Check-In</p>
                    <p className="text-lg font-bold text-gray-900">{formatDate(booking.checkInDate)}</p>
                </div>
                <div className="border border-gray-100 rounded-xl p-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Check-Out</p>
                    <p className="text-lg font-bold text-gray-900">{formatDate(booking.checkOutDate)}</p>
                </div>
            </div>
        </div>
    );
}