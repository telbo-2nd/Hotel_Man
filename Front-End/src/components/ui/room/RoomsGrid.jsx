import { BedDouble, Plus, Pencil, Trash2, Users } from "lucide-react";
import Button     from "../Button";
import EmptyState from "../EmptyState";
import Spinner    from "../Spinner";
import { formatCurrency } from "../../../utils/formatCurrency";

const STATUS_COLORS = {
    available:   "text-green-600",
    occupied:    "text-red-500",
    maintenance: "text-yellow-600",
};

const STATUS_DOTS = {
    available:   "bg-green-500",
    occupied:    "bg-red-500",
    maintenance: "bg-yellow-500",
};

const BORDER_COLORS = {
    "Single": "border-t-blue-400",
    "Double": "border-t-green-400",
    "Twin":   "border-t-purple-400",
    "Suite":  "border-t-yellow-400",
    "Deluxe": "border-t-orange-400",
};

export default function RoomsGrid({ data, isLoading, onAdd, onEdit, onDelete }) {
    if (isLoading) return <Spinner />;

    if (!data?.rooms?.length) {
        return (
            <EmptyState
                icon={BedDouble}
                title="No rooms found"
                description="Add your first room to get started"
                action={<Button icon={Plus} onClick={onAdd}>Add Room</Button>}
            />
        );
    }
    console.log(data.rooms);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.rooms.map((room) => (
                <div
                    key={room.id}
                    className={`bg-white rounded-xl border border-gray-100 border-t-4
                        ${BORDER_COLORS[room.RoomType?.name] || "border-t-[#1a3a6e]"}
                        p-4 hover:shadow-sm transition-all`}
                >
                    {/* header */}
                    <div className="flex items-start justify-between mb-3">
                        <p className="text-xl font-bold text-gray-900">{room.roomNumber}</p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => onEdit(room)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                                <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => onDelete(room)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* badges */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                            Floor {room.floor}
                        </span>
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                            {room.RoomType?.name}
                        </span>
                    </div>

                    {/* status */}
                    <div className="flex items-center gap-1.5 mb-3">
                        <span className={`w-2 h-2 rounded-full ${STATUS_DOTS[room.status]}`} />
                        <span className={`text-sm font-medium capitalize ${STATUS_COLORS[room.status]}`}>
                            {room.status}
                        </span>
                    </div>

                    {/* footer */}
                    <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-800">
                            {formatCurrency(room.RoomType?.price)}
                            <span className="text-xs text-gray-400 font-normal"> / night</span>
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Users className="w-3.5 h-3.5" />
                            {room.RoomType?.capacity}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}