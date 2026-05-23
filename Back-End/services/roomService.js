const { Op } = require("sequelize");
const AppError = require("../utils/AppError");
const { Room, RoomType, Booking } = require("../models");
const { createRoomSchema, updateRoomSchema } = require("../validators/roomValidator");
const { getConfig } = require("./hotelConfigService");  
// Find All
exports.findAllRooms = async (query) => {
    // pagination
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    // filtering
    const where = {};
    const { searchTerm, status, floor } = query;

    if (searchTerm) {
        where[Op.or] = [
            { roomNumber: { [Op.like]: `%${searchTerm}%` } },
        ];
    }

    // filter by status
    if (status) {
        where.status = status;
    }

    // filter by floor
    if (floor) {
        where.floor = Number(floor);
    }

    const { count: total, rows: rooms } = await Room.findAndCountAll({
        limit,
        offset: skip,
        where,
        order: [["createdAt", "DESC"], ["roomNumber", "ASC"]],
        // bring full RoomType object with each room
        include: {
            model: RoomType,
            attributes: { exclude: ["createdAt", "updatedAt"] },
        },
    });

    return {
        rooms,
        totalPages: Math.ceil(total / limit),
        page,
        limit,
        total,
    };
};

// Find By Id
exports.findRoomById = async (id) => {
    const room = await Room.findByPk(id, {
        include: {
            model: RoomType,
            attributes: { exclude: ["createdAt", "updatedAt"] },
        },
    });
    if (!room) throw new AppError("Room not found", 404);
    return room;
};

// Create
exports.createNewRoom = async (data) => {
    // validate
    const { error, value } = createRoomSchema.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((e) => e.message);
        throw new AppError(errors.join(", "), 400);
    }

    // check duplicate roomNumber
    const existingRoom = await Room.findOne({ where: { roomNumber: value.roomNumber } });
    if (existingRoom) throw new AppError("Room with this number already exists", 409);

    // check roomType exists
    const roomType = await RoomType.findByPk(value.roomTypeId);
    if (!roomType) throw new AppError("Room type not found", 404);

    const hotelFloors = parseInt(await getConfig("hotel_floors"));
    if (value.floor > hotelFloors) {
        throw new AppError(`Floor must be between 0 and ${hotelFloors}`, 400);
    }

    const newRoom = await Room.create(value);

    // return with RoomType included
    return await Room.findByPk(newRoom.id, {
        include: {
            model: RoomType,
            attributes: { exclude: ["createdAt", "updatedAt"] },
        },
    });
};

// Update
exports.updateRoomById = async (id, data) => {
    // validate
    const { error, value } = updateRoomSchema.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((e) => e.message);
        throw new AppError(errors.join(", "), 400);
    }

    const room = await Room.findByPk(id);
    if (!room) throw new AppError("Room not found", 404);

    // check duplicate roomNumber if being updated
    if (value.roomNumber) {
        const existingRoom = await Room.findOne({ where: { roomNumber: value.roomNumber } });
        if (existingRoom && existingRoom.id !== id) {
            throw new AppError("Room with this number already exists", 409);
        }
    }

    // check roomType exists if being updated
    if (value.roomTypeId) {
        const roomType = await RoomType.findByPk(value.roomTypeId);
        if (!roomType) throw new AppError("Room type not found", 404);
    }
    
    if (value.floor !== undefined) {
        const hotelFloors = parseInt(await getConfig("hotel_floors"));
        if (value.floor > hotelFloors) {
            throw new AppError(`Floor must be between 0 and ${hotelFloors}`, 400);
        }
    }

    const updatedRoom = await room.update(value);

    // return with RoomType included
    return await Room.findByPk(updatedRoom.id, {
        include: {
            model: RoomType,
            attributes: { exclude: ["createdAt", "updatedAt"] },
        },
    });
};

// Delete
exports.deleteRoomById = async (id) => {
    const room = await Room.findByPk(id);
    if (!room) throw new AppError("Room not found", 404);

    // prevent deleting an occupied room
    if (room.status === "occupied") {
        throw new AppError("Cannot delete a room that is currently occupied", 409);
    }

    try {
        await room.destroy();
    } catch (err) {
        if (err.name === "SequelizeForeignKeyConstraintError") {
            throw new AppError("Cannot delete a room that has bookings", 409);
        }
        throw err;
    }
};


// Available Rooms by Date
exports.findAvailableRooms = async (query) => {
    const { checkIn, checkOut, roomTypeId, capacity, minPrice, maxPrice } = query;

    // validate dates exist
    if (!checkIn || !checkOut) {
        throw new AppError("checkIn and checkOut dates are required", 400);
    }

    const checkInDate  = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const checkInStr  = checkInDate.toISOString().split("T")[0];
    const checkOutStr = checkOutDate.toISOString().split("T")[0];

    // validate date logic
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        throw new AppError("Invalid date format", 400);
    }
    if (checkOutDate <= checkInDate) {
        throw new AppError("checkOut must be after checkIn", 400);
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (checkInDate < today) {
        throw new AppError("checkIn cannot be in the past", 400);
    }

    // validate max booking days from hotel config
    const { getConfig } = require("./hotelConfigService");
    const maxBookingDays = parseInt(await getConfig("max_booking_days"));
    const noOfNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    if (noOfNights > maxBookingDays) {
        throw new AppError(`Cannot book more than ${maxBookingDays} nights`, 400);
    }

    // find all roomIds that are booked and overlap with the given dates
    const bookedRoomIds = await Booking.findAll({
        attributes: ["roomId"],
        where: {
            status: { [Op.notIn]: ["cancelled", "checked-out"] },
            [Op.and]: [
                { checkInDate:  { [Op.lt]: checkOutStr } },
                { checkOutDate: { [Op.gt]: checkInStr  } },
            ],
        },
        raw: true,
    });

    const bookedIds = bookedRoomIds.map((b) => b.roomId);

    // build room type filter
    const roomTypeWhere = {};

    if (roomTypeId) {
        roomTypeWhere.id = roomTypeId;
    }
    if (capacity) {
        roomTypeWhere.capacity = { [Op.gte]: Number(capacity) };
    }
    if (minPrice && maxPrice) {
        roomTypeWhere.price = { [Op.between]: [Number(minPrice), Number(maxPrice)] };
    } else if (minPrice) {
        roomTypeWhere.price = { [Op.gte]: Number(minPrice) };
    } else if (maxPrice) {
        roomTypeWhere.price = { [Op.lte]: Number(maxPrice) };
    }

    // find all available rooms — not booked, not maintenance, passes filters
    const availableRooms = await Room.findAll({
        where: {
            status:  { [Op.ne]: "maintenance" },
            ...(bookedIds.length > 0 && { id: { [Op.notIn]: bookedIds } }),
        },
        include: {
            model: RoomType,
            attributes: { exclude: ["createdAt", "updatedAt"] },
            where: Object.keys(roomTypeWhere).length > 0 ? roomTypeWhere : undefined,
        },
        order: [
            [RoomType, "price", "ASC"],
            ["floor", "ASC"],
            ["roomNumber", "ASC"],
        ],
    });

    // calculate price for the stay per room
    const roomsWithPrice = availableRooms.map((room) => ({
        ...room.toJSON(),
        stayPrice: room.RoomType.price * noOfNights,
        noOfNights,
    }));

    return {
        checkIn:        checkInDate.toDateString(),
        checkOut:       checkOutDate.toDateString(),
        noOfNights,
        totalAvailable: roomsWithPrice.length,
        rooms:          roomsWithPrice,
    };
};