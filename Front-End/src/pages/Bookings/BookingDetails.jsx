import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBooking, useUpdateBooking } from "../../hooks/useBookings";
import Spinner from "../../components/ui/Spinner";

import BookingDetailsHeader from "../../components/ui/bookings/BookingDetailsHeader";
import BookingInfoCard      from "../../components/ui/bookings/BookingInfoCard";
import BookingServicesCard  from "../../components/ui/bookings/BookingServicesCard";
import PaymentSummaryCard   from "../../components/ui/bookings/PaymentSummaryCard";
import GuestDetailsCard     from "../../components/ui/bookings/GuestDetailsCard";
import RoomDetailsCard      from "../../components/ui/bookings/RoomDetailsCard";

const ALLOWED_TRANSITIONS = {
    "pending":     ["confirmed", "cancelled"],
    "confirmed":   ["checked-in", "cancelled"],
    "checked-in":  ["checked-out"],
    "checked-out": [],
    "cancelled":   [],
};

export default function BookingDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [updating, setUpdating] = useState(false);

    const { data, isLoading } = useBooking(id);
    const { mutate: updateBooking } = useUpdateBooking();

    const booking  = data?.booking;

    if (isLoading) return <Spinner />;
    if (!booking)  return <div className="text-center py-20 text-gray-500">Booking not found</div>;

    const guest    = booking.Guest;
    const room     = booking.Room;
    const roomType = booking.Room?.RoomType;
    const services = booking.Services || [];

    const nights        = Math.ceil((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24));
    const roomTotal     = roomType ? roomType.price * nights : 0;
    const servicesTotal = services.reduce((sum, s) => sum + s.price * (s.BookingService?.quantity || 1), 0);

    const isCheckInDay  = new Date().toDateString() === new Date(booking.checkInDate).toDateString();
    const allowedNext   = (ALLOWED_TRANSITIONS[booking.status] || []).filter(
        (next) => next !== "checked-in" || isCheckInDay
    );

    const handleStatusChange = (newStatus) => {
        setUpdating(true);
        updateBooking({ id, data: { status: newStatus } }, {
            onSuccess: () => setUpdating(false),
            onError:   () => setUpdating(false),
        });
    };

    return (
        <div className="space-y-5">

            <BookingDetailsHeader
                booking={booking}
                allowedNext={allowedNext}
                updating={updating}
                onBack={() => navigate("/bookings")}
                onStatusChange={handleStatusChange}
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

                {/* Left column */}
                <div className="xl:col-span-2 space-y-5">
                    <BookingInfoCard booking={booking} nights={nights} />
                    <BookingServicesCard services={services} />
                    <PaymentSummaryCard
                        nights={nights}
                        roomType={roomType}
                        roomTotal={roomTotal}
                        servicesTotal={servicesTotal}
                        totalPrice={booking.totalPrice}
                    />
                </div>

                {/* Right column */}
                <div className="space-y-4">
                    <GuestDetailsCard
                        guest={guest}
                        onViewProfile={() => navigate(`/guests/${guest?.id}`)}
                    />
                    <RoomDetailsCard room={room} roomType={roomType} />
                </div>
            </div>
        </div>
    );
}