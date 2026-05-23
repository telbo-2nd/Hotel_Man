import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";

import { useGuest, useUpdateGuest, useDeleteGuest } from "../../hooks/useGuests";
import { useBookings } from "../../hooks/useBookings";
import Spinner from "../../components/ui/Spinner";

import GuestProfileCard    from "../../components/ui/guests/GuestProfileCard";
import GuestStatsCards     from "../../components/ui/guests/GuestStatsCards";
import GuestBookingHistory from "../../components/ui/guests/GuestBookingHistory";
import EditGuestModal      from "../../components/ui/guests/EditGuestModal";
import GuestDeleteModal    from "../../components/ui/guests/GuestDeleteModal";

export default function GuestDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [editModal,   setEditModal]   = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const { data: guestData,    isLoading: guestLoading    } = useGuest(id);
    const { data: bookingsData, isLoading: bookingsLoading } = useBookings({ guestId: id, limit: 100 });

    const { mutate: updateGuest, isPending: updating } = useUpdateGuest();
    const { mutate: deleteGuest, isPending: deleting } = useDeleteGuest();

    const editForm = useForm();

    const guest    = guestData?.guest;
    const bookings = bookingsData?.bookings || [];

    const totalSpent = bookings
        .filter((b) => b.status !== "cancelled")
        .reduce((sum, b) => sum + b.totalPrice, 0);

    const openEdit = () => {
        editForm.setValue("Firstname", guest.Firstname);
        editForm.setValue("Lastname",  guest.Lastname);
        editForm.setValue("phone",     guest.phone);
        editForm.setValue("email",     guest.email);
        setEditModal(true);
    };

    const handleEdit = (data) => {
        updateGuest({ id, data }, { onSuccess: () => setEditModal(false) });
    };

    const handleDelete = () => {
        deleteGuest(id, { onSuccess: () => navigate("/guests") });
    };

    if (guestLoading) return <Spinner />;
    if (!guest) return <div className="text-center py-20 text-gray-500">Guest not found</div>;

    return (
        <div className="space-y-5">

            {/* Back + Breadcrumb */}
            <button
                onClick={() => navigate("/guests")}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a3a6e] transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Guests
            </button>

            <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="hover:text-[#1a3a6e] cursor-pointer" onClick={() => navigate("/guests")}>
                    Guests
                </span>
                <span>›</span>
                <span className="text-gray-700 font-medium">{guest.Firstname} {guest.Lastname}</span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

                {/* Left column */}
                <div className="space-y-4">
                    <GuestProfileCard
                        guest={guest}
                        onEdit={openEdit}
                        onDelete={() => setDeleteModal(true)}
                    />
                </div>

                {/* Right column */}
                <div className="xl:col-span-2 space-y-4">
                    <GuestStatsCards
                        totalBookings={bookings.length}
                        totalSpent={totalSpent}
                    />
                    <GuestBookingHistory
                        bookings={bookings}
                        isLoading={bookingsLoading}
                        onBookingClick={(bookingId) => navigate(`/bookings/${bookingId}`)}
                    />
                </div>
            </div>

            <EditGuestModal
                isOpen={editModal}
                onClose={() => setEditModal(false)}
                form={editForm}
                onSubmit={handleEdit}
                updating={updating}
            />

            <GuestDeleteModal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                guest={guest}
                onConfirm={handleDelete}
                deleting={deleting}
            />
        </div>
    );
}