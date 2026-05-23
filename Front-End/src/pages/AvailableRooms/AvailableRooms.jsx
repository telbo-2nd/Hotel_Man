import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAvailableRooms } from "../../hooks/useRooms";
import { useRoomTypes }      from "../../hooks/useRoomTypes";

import AvailabilitySearchPanel from "../../components/ui/availableRooms/AvailabilitySearchPanel";
import AvailableRoomsGrid      from "../../components/ui/availableRooms/AvailableRoomsGrid";

export default function AvailableRooms() {
    const navigate = useNavigate();

    const [checkIn,      setCheckIn]      = useState("");
    const [checkOut,     setCheckOut]     = useState("");
    const [capacity,     setCapacity]     = useState("");
    const [minPrice,     setMinPrice]     = useState("");
    const [maxPrice,     setMaxPrice]     = useState("");
    const [roomTypeId,   setRoomTypeId]   = useState("");
    const [searched,     setSearched]     = useState(false);
    const [searchParams, setSearchParams] = useState(null);

    const { data: roomTypesData } = useRoomTypes({ limit: 100 });
    const roomTypes = roomTypesData?.roomTypes || [];

    const { data, isLoading } = useAvailableRooms(searchParams, !!searchParams);
    const rooms = data?.rooms || [];

    const handleSearch = () => {
        if (!checkIn || !checkOut) return;
        setSearchParams({
            checkIn,
            checkOut,
            ...(capacity   && { capacity }),
            ...(minPrice   && { minPrice }),
            ...(maxPrice   && { maxPrice }),
            ...(roomTypeId && { roomTypeId }),
        });
        setSearched(true);
    };

    const handleBookNow = (room) => {
        navigate("/bookings", {
            state: {
                roomId:     room.id,
                roomNumber: room.roomNumber,
                roomType:   room.RoomType?.name,
                checkIn,
                checkOut,
                stayPrice:  room.stayPrice,
                noOfNights: data.noOfNights,
            },
        });
    };

    return (
        <div className="space-y-5">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Room Availability</h1>
                <p className="text-sm text-gray-500 mt-0.5">Search and book available rooms for guests</p>
            </div>

            <AvailabilitySearchPanel
                checkIn={checkIn}       setCheckIn={setCheckIn}
                checkOut={checkOut}     setCheckOut={setCheckOut}
                capacity={capacity}     setCapacity={setCapacity}
                minPrice={minPrice}     setMinPrice={setMinPrice}
                maxPrice={maxPrice}     setMaxPrice={setMaxPrice}
                roomTypeId={roomTypeId} setRoomTypeId={setRoomTypeId}
                roomTypes={roomTypes}
                onSearch={handleSearch}
            />

            <AvailableRoomsGrid
                data={data}
                rooms={rooms}
                isLoading={isLoading}
                searched={searched}
                onBookNow={handleBookNow}
            />
        </div>
    );
}