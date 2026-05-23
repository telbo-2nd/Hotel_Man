const { Op } = require("sequelize");
const AppError = require("../utils/AppError");
const { Booking, Guest, Room, RoomType, Service, BookingService } = require("../models");
const { createBookingSchema, updateBookingSchema } = require("../validators/bookingValidator");
const { getConfig } = require("./hotelConfigService");
const emailService = require("./emailService");


// Find All
exports.findAllBookings = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {};
    const { status, guestId, roomId } = query;

    if (status)  where.status  = status;
    if (guestId) where.guestId = guestId;
    if (roomId)  where.roomId  = roomId;

    const { count: total, rows: bookings } = await Booking.findAndCountAll({
        limit,
        offset: skip,
        where,
        order: [["createdAt", "DESC"]],
        include: [
            {
                model: Guest,
                attributes: { exclude: ["createdAt", "updatedAt"] },
            },
            {
                model: Room,
                attributes: { exclude: ["createdAt", "updatedAt"] },
                include: {
                    model: RoomType,
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                },
            },
            {
                model: Service,
                attributes: { exclude: ["createdAt", "updatedAt"] },
                through: { attributes: ["quantity"] },
            },
        ],
    });

    return { bookings, totalPages: Math.ceil(total / limit), page, limit, total };
};

// Find By Id
exports.findBookingById = async (id) => {
    const booking = await Booking.findByPk(id, {
        include: [
            {
                model: Guest,
                attributes: { exclude: ["createdAt", "updatedAt"] },
            },
            {
                model: Room,
                attributes: { exclude: ["createdAt", "updatedAt"] },
                include: {
                    model: RoomType,
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                },
            },
            {
                model: Service,
                attributes: { exclude: ["createdAt", "updatedAt"] },
                through: { attributes: ["quantity"] },
            },
        ],
    });
    if (!booking) throw new AppError("Booking not found", 404);
    return booking;
};

// Create
exports.createNewBooking = async (data) => {
    // validate
    const { error, value } = createBookingSchema.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((e) => e.message);
        throw new AppError(errors.join(", "), 400);
    }

    const { guestId, roomId, checkInDate, checkOutDate, services } = value;
    const checkIn  = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const checkInStr  = checkIn.toISOString().split("T")[0];
    const checkOutStr = checkOut.toISOString().split("T")[0];

    if (checkOut <= checkIn) {
        throw new AppError("checkOut must be after checkIn", 400);
    }

    // check guest exists
    const guest = await Guest.findByPk(guestId);
    if (!guest) throw new AppError("Guest not found", 404);

    // check room exists
    const room = await Room.findByPk(roomId, {
        include: {
            model: RoomType,
            attributes: ["id", "name", "price", "capacity"],
        },
    });
    if (!room) throw new AppError("Room not found", 404);

    if (room.status === "maintenance") {
        throw new AppError("Room is currently under maintenance", 400);
    }

    const overlappingBooking = await Booking.findOne({
        where: {
            roomId,
            status: { [Op.notIn]: ["cancelled", "checked-out"] },
            [Op.and]: [
                { checkInDate:  { [Op.lt]: checkOutStr } },  
                { checkOutDate: { [Op.gt]: checkInStr  } },  
            ],
        },
    });
    if (overlappingBooking) {
        throw new AppError("Room is already booked for the selected dates", 409);
    }

    // validate max booking days
    const noOfNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const maxBookingDays = parseInt(await getConfig("max_booking_days"));
    if (noOfNights > maxBookingDays) {
        throw new AppError(`Cannot book more than ${maxBookingDays} nights in one reservation`, 400);
    }

    // calculate price
    const roomPricePerNight = room.RoomType ? room.RoomType.price : 0;
    let totalPrice = roomPricePerNight * noOfNights;

    // create booking
    const newBooking = await Booking.create({
        guestId,
        roomId,
        checkInDate,
        checkOutDate,
        totalPrice,
        status: "pending",
    });

    // handle services
    if (services && services.length > 0) {
        const foundServices = await Service.findAll({
            where: { id: services.map((s) => s.serviceId) },
        });
        if (foundServices.length !== services.length) {
            throw new AppError("One or more services not found", 404);
        }
        if (foundServices.some((s) => s.status !== "available")) {
        const unavailableServices = foundServices
            .filter((s) => s.status !== "available")
            .map((s) => s.name)
            .join(", ");

        throw new AppError(
            `${unavailableServices} services are currently unavailable`,
            400
        );  
    }
        await BookingService.bulkCreate(
            services.map((s) => ({ ...s, bookingId: newBooking.id }))
        );

        const servicesTotalPrice = foundServices.reduce((total, service) => {
            const qty = services.find((s) => s.serviceId === service.id)?.quantity || 1;
            return total + service.price * qty;
        }, 0);

        totalPrice += servicesTotalPrice;
        await newBooking.update({ totalPrice });
    }

    const fullBooking = await exports.findBookingById(newBooking.id);
    
    await emailService.sendBookingCreated(
    fullBooking.Guest,
    fullBooking,
    fullBooking.Room,
    fullBooking.Room.RoomType,
    fullBooking.Services
    );

    return fullBooking;
};

// Update Status
exports.updateBookingById = async (id, data) => {
    const { error, value } = updateBookingSchema.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((e) => e.message);
        throw new AppError(errors.join(", "), 400);
    }

    const booking = await Booking.findByPk(id, {
        include: { model: Room },
    });
    if (!booking) throw new AppError("Booking not found", 404);

    const currentStatus = booking.status;
    const newStatus = value.status;

    const allowedTransitions = {
        "pending":     ["confirmed", "cancelled"],
        "confirmed":   ["checked-in", "cancelled"],
        "checked-in":  ["checked-out"],
        "checked-out": [],
        "cancelled":   [],
    };

    if (!allowedTransitions[currentStatus].includes(newStatus)) {
        throw new AppError(
            `Cannot transition booking from "${currentStatus}" to "${newStatus}"`,
            400
        );
    }

    if (newStatus === "checked-in") {
        await booking.Room.update({ status: "occupied" });
    }

    if (newStatus === "checked-out" || newStatus === "cancelled") {
        await booking.Room.update({ status: "available" });
    }

    await booking.update({ status: newStatus });
    
    const fullBooking = await exports.findBookingById(id);

    if (newStatus === "cancelled") {
        emailService.sendCancellationEmail(
            fullBooking.Guest,
            fullBooking,
            fullBooking.Room,
        );
    }

    if (newStatus === "checked-out") {
        const checkOutTime = await getConfig("check_out_time");
        emailService.sendInvoice(
            fullBooking.Guest,
            fullBooking,
            fullBooking.Room,
            fullBooking.Room.RoomType,
            fullBooking.Services,
            checkOutTime
        );
    }

    if (newStatus === "confirmed") {
        emailService.sendBookingConfirmation(
            fullBooking.Guest,
            fullBooking,
            fullBooking.Room,
            fullBooking.Room.RoomType,
            fullBooking.Services
        );
    }

    return fullBooking;
};
// Delete
exports.deleteBookingById = async (id) => {
    const booking = await Booking.findByPk(id, {
        include: { model: Room },
    });
    if (!booking) throw new AppError("Booking not found", 404);

    if (booking.status !== "cancelled") {
        throw new AppError("Only cancelled bookings can be deleted", 400);
    }

    await booking.destroy();
};