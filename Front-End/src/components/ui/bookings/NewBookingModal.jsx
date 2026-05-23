import Modal  from "../Modal";
import Button from "../Button";
import { formatCurrency } from "../../../utils/formatCurrency";

const STEPS = ["Dates & Room", "Select Guest", "Services"];

// ── Step Indicator ────────────────────────────────────────────────────────────
function StepIndicator({ step }) {
    return (
        <div className="flex items-center gap-2">
            {STEPS.map((label, i) => (
                <div key={label} className="flex items-center gap-2 flex-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                        ${step > i + 1 ? "bg-green-500 text-white" :
                          step === i + 1 ? "bg-[#1a3a6e] text-white" :
                          "bg-gray-100 text-gray-400"}`}
                    >
                        {step > i + 1 ? "✓" : i + 1}
                    </div>
                    <span className={`text-xs font-medium ${step === i + 1 ? "text-[#1a3a6e]" : "text-gray-400"}`}>
                        {label}
                    </span>
                    {i < 2 && <div className="flex-1 h-px bg-gray-200" />}
                </div>
            ))}
        </div>
    );
}

// ── Step 1: Dates & Room ──────────────────────────────────────────────────────
function StepDatesRoom({ checkIn, checkOut, roomId, nights, prefilled, setCheckIn, setCheckOut, setRoomId, onNext }) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Check-in Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={checkIn}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Check-out Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={checkOut}
                        min={checkIn || new Date().toISOString().split("T")[0]}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100"
                    />
                </div>
            </div>

            {nights > 0 && (
                <div className="bg-blue-50 rounded-lg px-4 py-2.5 text-sm text-[#1a3a6e] font-medium">
                    {nights} night{nights > 1 ? "s" : ""}
                </div>
            )}

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                    Room ID <span className="text-red-500">*</span>
                </label>
                <input
                    placeholder="Paste room ID or use Available Rooms page to pre-fill"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100"
                />
                <p className="text-xs text-gray-400">
                    Tip: Use the Available Rooms page and click "Book Now" to auto-fill this
                </p>
            </div>

            {prefilled?.roomNumber && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm">
                    <p className="font-medium text-green-800">
                        Room {prefilled.roomNumber} — {prefilled.roomType}
                    </p>
                    <p className="text-green-600 text-xs mt-0.5">
                        Pre-filled from availability search · Total: {formatCurrency(prefilled.stayPrice)}
                    </p>
                </div>
            )}

            <div className="flex gap-3 pt-2">
                <Button className="flex-1" disabled={!checkIn || !checkOut || !roomId} onClick={onNext}>
                    Next — Select Guest
                </Button>
            </div>
        </div>
    );
}

// ── Step 2: Select Guest ──────────────────────────────────────────────────────
function StepSelectGuest({ guestId, guests, setGuestId, onBack, onNext }) {
    const selectedGuest = guests.find((g) => g.id === guestId);

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                    Select Guest <span className="text-red-500">*</span>
                </label>
                <select
                    value={guestId}
                    onChange={(e) => setGuestId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1a3a6e] bg-white"
                >
                    <option value="">Choose a guest...</option>
                    {guests.map((g) => (
                        <option key={g.id} value={g.id}>
                            {g.Firstname} {g.Lastname} — {g.nationalId}
                        </option>
                    ))}
                </select>
            </div>

            {selectedGuest && (
                <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1a3a6e] flex items-center justify-center text-white text-sm font-bold">
                        {selectedGuest.Firstname[0]}{selectedGuest.Lastname[0]}
                    </div>
                    <div>
                        <p className="font-medium text-gray-800">{selectedGuest.Firstname} {selectedGuest.Lastname}</p>
                        <p className="text-xs text-gray-500">{selectedGuest.email} · {selectedGuest.phone}</p>
                    </div>
                </div>
            )}

            <div className="flex gap-3 pt-2">
                <Button variant="secondary" className="flex-1" onClick={onBack}>Back</Button>
                <Button className="flex-1" disabled={!guestId} onClick={onNext}>Next — Services</Button>
            </div>
        </div>
    );
}

// ── Step 3: Services ──────────────────────────────────────────────────────────
function StepServices({ services, selectedServices, toggleService, updateQuantity, onBack, onConfirm, creating }) {
    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-500">Select additional services for this booking (optional)</p>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {services.map((service) => {
                    const isSelected = selectedServices.find((s) => s.serviceId === service.id);
                    return (
                        <div
                            key={service.id}
                            onClick={() => toggleService(service.id)}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer
                                ${isSelected ? "border-[#1a3a6e] bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all
                                    ${isSelected ? "bg-[#1a3a6e] border-[#1a3a6e]" : "border-gray-300"}`}
                                >
                                    {isSelected && <span className="text-white text-xs">✓</span>}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{service.name}</p>
                                    <p className="text-xs text-gray-400">{formatCurrency(service.price)} per unit</p>
                                </div>
                            </div>
                            {isSelected && (
                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                    <span className="text-xs text-gray-500">Qty:</span>
                                    <input
                                        type="number"
                                        min="1"
                                        value={isSelected.quantity}
                                        onChange={(e) => updateQuantity(service.id, e.target.value)}
                                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1a3a6e] text-center"
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {selectedServices.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    <p className="font-medium text-gray-700">
                        {selectedServices.length} service{selectedServices.length > 1 ? "s" : ""} selected
                    </p>
                </div>
            )}

            <div className="flex gap-3 pt-2">
                <Button variant="secondary" className="flex-1" onClick={onBack}>Back</Button>
                <Button className="flex-1" loading={creating} onClick={onConfirm}>Confirm Booking</Button>
            </div>
        </div>
    );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function NewBookingModal({
    isOpen,
    onClose,
    step,
    setStep,
    // step 1
    checkIn, setCheckIn,
    checkOut, setCheckOut,
    roomId, setRoomId,
    nights,
    prefilled,
    // step 2
    guestId, setGuestId,
    guests,
    // step 3
    services,
    selectedServices,
    toggleService,
    updateQuantity,
    onConfirm,
    creating,
}) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`New Booking — Step ${step} of 3`}
            size="lg"
        >
            <div className="space-y-5">
                <StepIndicator step={step} />

                {step === 1 && (
                    <StepDatesRoom
                        checkIn={checkIn} setCheckIn={setCheckIn}
                        checkOut={checkOut} setCheckOut={setCheckOut}
                        roomId={roomId} setRoomId={setRoomId}
                        nights={nights}
                        prefilled={prefilled}
                        onNext={() => setStep(2)}
                    />
                )}
                {step === 2 && (
                    <StepSelectGuest
                        guestId={guestId} setGuestId={setGuestId}
                        guests={guests}
                        onBack={() => setStep(1)}
                        onNext={() => setStep(3)}
                    />
                )}
                {step === 3 && (
                    <StepServices
                        services={services}
                        selectedServices={selectedServices}
                        toggleService={toggleService}
                        updateQuantity={updateQuantity}
                        onBack={() => setStep(2)}
                        onConfirm={onConfirm}
                        creating={creating}
                    />
                )}
            </div>
        </Modal>
    );
}