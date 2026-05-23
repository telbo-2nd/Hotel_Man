import { BedDouble, Users } from "lucide-react";
import Button     from "../Button";
import EmptyState from "../EmptyState";
import Spinner    from "../Spinner";
import { formatCurrency } from "../../../utils/formatCurrency";

const ROOM_PHOTOS = {
    "Single":  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop",
    "Double":  "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&auto=format&fit=crop",
    "Twin":    "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=600&auto=format&fit=crop",
    "Suite":   "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&auto=format&fit=crop",
    "Deluxe":  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop",
    "default": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop",
};

export default function AvailableRoomsGrid({ data, rooms, isLoading, searched, onBookNow }) {
    if (isLoading) return <Spinner />;

    if (searched && rooms.length === 0) {
        return (
            <EmptyState
                icon={BedDouble}
                title="No rooms available"
                description="Try different dates or adjust your filters"
            />
        );
    }

    if (searched && rooms.length > 0) {
        return (
            <>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Found{" "}
                        <span className="font-semibold text-[#1a3a6e]">{data.totalAvailable}</span>
                        {" "}rooms matching your preferences
                    </p>
                    <p className="text-sm text-gray-500">
                        {data.noOfNights} night{data.noOfNights > 1 ? "s" : ""} · {data.checkIn} → {data.checkOut}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={ROOM_PHOTOS[room.RoomType?.name] || ROOM_PHOTOS["default"]}
                                    alt={room.RoomType?.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 left-3">
                                    <span className="bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                                        AVAILABLE
                                    </span>
                                </div>
                                <div className="absolute top-3 right-3">
                                    <span className="bg-black/50 text-white text-xs font-medium px-2 py-1 rounded-lg backdrop-blur-sm">
                                        RM-{room.roomNumber}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="text-base font-bold text-gray-900 mb-1">{room.RoomType?.name}</h3>
                                <p className="text-sm text-gray-500 mb-3">
                                    Floor {room.floor} · Room {room.roomNumber}
                                </p>

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                        <Users className="w-4 h-4" />
                                        {room.RoomType?.capacity} Guests
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                        <BedDouble className="w-4 h-4" />
                                        {room.RoomType?.name}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <div>
                                        <p className="text-xs text-gray-400">Nightly</p>
                                        <p className="text-xl font-bold text-[#1a3a6e]">
                                            {formatCurrency(room.RoomType?.price)}
                                            <span className="text-xs text-gray-400 font-normal">/night</span>
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Total: {formatCurrency(room.stayPrice)} ({data.noOfNights}n)
                                        </p>
                                    </div>
                                    <Button onClick={() => onBookNow(room)}>Book Now</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    }

    // idle state — no search yet
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <BedDouble className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
                Select dates above and click Search to find available rooms
            </p>
        </div>
    );
}