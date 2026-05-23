import { formatCurrency } from "../../../utils/formatCurrency";

const ROOM_PHOTOS = {
    "Single":  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop",
    "Double":  "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&auto=format&fit=crop",
    "Twin":    "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=600&auto=format&fit=crop",
    "Suite":   "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&auto=format&fit=crop",
    "Deluxe":  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop",
    "default": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop",
};

export default function RoomDetailsCard({ room, roomType }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="relative h-36">
                <img
                    src={ROOM_PHOTOS[roomType?.name] || ROOM_PHOTOS["default"]}
                    alt={roomType?.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                    <p className="font-bold">Room {room?.roomNumber}</p>
                </div>
            </div>
            <div className="p-4">
                <p className="font-bold text-gray-900 text-base">{roomType?.name}</p>
                <p className="text-sm text-gray-500 mt-1">
                    Floor {room?.floor} · {roomType?.capacity} Guests
                </p>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400">Per night</span>
                    <span className="font-bold text-[#1a3a6e]">{formatCurrency(roomType?.price || 0)}</span>
                </div>
            </div>
        </div>
    );
}