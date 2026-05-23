import { ArrowLeft } from "lucide-react";
import Badge from "../Badge";

const STATUS_LABELS = {
    confirmed:     "Confirm",
    "checked-in":  "Check In",
    "checked-out": "Check Out",
    cancelled:     "Cancel",
};

const STATUS_COLORS = {
    confirmed:     "bg-blue-600 hover:bg-blue-700",
    "checked-in":  "bg-green-600 hover:bg-green-700",
    "checked-out": "bg-gray-600 hover:bg-gray-700",
    cancelled:     "bg-red-600 hover:bg-red-700",
};

export default function BookingDetailsHeader({ booking, allowedNext, updating, onBack, onStatusChange }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a3a6e] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-[#1a3a6e]">
                        Booking #{booking.id.slice(0, 8).toUpperCase()}
                    </h1>
                    <Badge status={booking.status} />
                </div>
            </div>

            {allowedNext.length > 0 && (
                <div className="flex items-center gap-2">
                    {allowedNext.map((next) => (
                        <button
                            key={next}
                            onClick={() => onStatusChange(next)}
                            disabled={updating}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50
                                ${STATUS_COLORS[next] || "bg-[#1a3a6e] hover:bg-[#162f58]"}`}
                        >
                            {updating ? "Updating..." : STATUS_LABELS[next] || next}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}