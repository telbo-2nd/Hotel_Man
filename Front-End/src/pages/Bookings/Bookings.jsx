import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";

import { useBookings, useCreateBooking, useDeleteBooking } from "../../hooks/useBookings";
import { useGuests }   from "../../hooks/useGuests";
import { useServices } from "../../hooks/useServices";
import Button from "../../components/ui/Button";

import BookingStatusTabs  from "../../components/ui/bookings/BookingStatusTabs";
import BookingsTable      from "../../components/ui/bookings/BookingsTable";
import NewBookingModal    from "../../components/ui/bookings/NewBookingModal";
import DeleteBookingModal from "../../components/ui/bookings/DeleteBookingModal";

export default function Bookings() {
    const navigate = useNavigate();
    const location = useLocation();

    const prefilled = location.state;

    const [page,      setPage]      = useState(1);
    const [status,    setStatus]    = useState("all");
    const [addModal,  setAddModal]  = useState(!!prefilled);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selected,  setSelected]  = useState(null);
    const [openMenu,  setOpenMenu]  = useState(null);

    // new booking form state
    const [guestId,          setGuestId]          = useState("");
    const [roomId,           setRoomId]            = useState(prefilled?.roomId   || "");
    const [checkIn,          setCheckIn]           = useState(prefilled?.checkIn  || "");
    const [checkOut,         setCheckOut]          = useState(prefilled?.checkOut || "");
    const [selectedServices, setSelectedServices]  = useState([]);
    const [step,             setStep]              = useState(prefilled ? 2 : 1);

    const { data, isLoading } = useBookings({
        page,
        limit: 10,
        ...(status !== "all" && { status }),
    });

    const { data: guestsData }   = useGuests({ limit: 100 });
    const { data: servicesData } = useServices({ limit: 100 });

    const guests   = guestsData?.guests   || [];
    const services = servicesData?.services || [];

    const { mutate: createBooking, isPending: creating } = useCreateBooking();
    const { mutate: deleteBooking, isPending: deleting } = useDeleteBooking();

    const nights = checkIn && checkOut
        ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
        : 0;

    const toggleService = (serviceId) => {
        setSelectedServices((prev) =>
            prev.find((s) => s.serviceId === serviceId)
                ? prev.filter((s) => s.serviceId !== serviceId)
                : [...prev, { serviceId, quantity: 1 }]
        );
    };

    const updateQuantity = (serviceId, quantity) => {
        setSelectedServices((prev) =>
            prev.map((s) => s.serviceId === serviceId ? { ...s, quantity: Number(quantity) } : s)
        );
    };

    const resetForm = () => {
        setGuestId(""); setRoomId(""); setCheckIn("");
        setCheckOut(""); setSelectedServices([]); setStep(1);
    };

    const handleCreate = () => {
        if (!guestId || !roomId || !checkIn || !checkOut) return;
        createBooking(
            { guestId, roomId, checkInDate: checkIn, checkOutDate: checkOut, services: selectedServices },
            {
                onSuccess: () => {
                    setAddModal(false);
                    resetForm();
                    navigate("/bookings", { replace: true, state: null });
                },
            }
        );
    };

    const handleDeleteConfirm = () => {
        deleteBooking(selected.id, {
            onSuccess: () => { setDeleteModal(false); setSelected(null); },
        });
    };

    const openAddModal = () => { resetForm(); setAddModal(true); };

    const closeAddModal = () => {
        setAddModal(false);
        resetForm();
        navigate("/bookings", { replace: true, state: null });
    };

    return (
        <div className="space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Manage and monitor all hotel reservations in real-time
                    </p>
                </div>
                <Button icon={Plus} onClick={openAddModal}>+ New Booking</Button>
            </div>

            <BookingStatusTabs
                status={status}
                onStatusChange={(s) => { setStatus(s); setPage(1); }}
            />

            <BookingsTable
                data={data}
                isLoading={isLoading}
                page={page}
                openMenu={openMenu}
                onPageChange={setPage}
                onOpenMenu={setOpenMenu}
                onView={(id) => navigate(`/bookings/${id}`)}
                onNewBooking={openAddModal}
                onDeleteClick={(booking) => { setSelected(booking); setDeleteModal(true); }}
            />

            <NewBookingModal
                isOpen={addModal}
                onClose={closeAddModal}
                step={step} setStep={setStep}
                checkIn={checkIn} setCheckIn={setCheckIn}
                checkOut={checkOut} setCheckOut={setCheckOut}
                roomId={roomId} setRoomId={setRoomId}
                nights={nights}
                prefilled={prefilled}
                guestId={guestId} setGuestId={setGuestId}
                guests={guests}
                services={services}
                selectedServices={selectedServices}
                toggleService={toggleService}
                updateQuantity={updateQuantity}
                onConfirm={handleCreate}
                creating={creating}
            />

            <DeleteBookingModal
                isOpen={deleteModal}
                onClose={() => { setDeleteModal(false); setSelected(null); }}
                onConfirm={handleDeleteConfirm}
                deleting={deleting}
            />
        </div>
    );
}