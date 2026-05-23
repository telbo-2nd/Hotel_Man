import { Search, Calendar } from "lucide-react";
import Button from "../Button";

export default function AvailabilitySearchPanel({
    checkIn, setCheckIn,
    checkOut, setCheckOut,
    capacity, setCapacity,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    roomTypeId, setRoomTypeId,
    roomTypes,
    onSearch,
}) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                Reservation Details
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">

                {/* Check-in */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Check-in</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="date"
                            value={checkIn}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                </div>

                {/* Check-out */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Check-out</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="date"
                            value={checkOut}
                            min={checkIn || new Date().toISOString().split("T")[0]}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                </div>

                {/* Capacity */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Guests</label>
                    <input
                        type="number"
                        min="1"
                        placeholder="Number of guests"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#1a3a6e] focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                {/* Room Type */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Room Type</label>
                    <select
                        value={roomTypeId}
                        onChange={(e) => setRoomTypeId(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#1a3a6e] bg-white"
                    >
                        <option value="">All Types</option>
                        {roomTypes.map((rt) => (
                            <option key={rt.id} value={rt.id}>{rt.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Price Range */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Price Range</span>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-24 pl-6 pr-2 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#1a3a6e]"
                        />
                    </div>
                    <span className="text-gray-400">—</span>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-24 pl-6 pr-2 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#1a3a6e]"
                        />
                    </div>
                </div>
            </div>

            <Button
                icon={Search}
                onClick={onSearch}
                disabled={!checkIn || !checkOut}
                className="w-full sm:w-auto px-8"
            >
                Search Availability
            </Button>
        </div>
    );
}