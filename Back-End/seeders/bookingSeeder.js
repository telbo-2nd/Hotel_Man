require("dotenv").config();
const { Booking, Guest, Room, Service, BookingService, RoomType, sequelize } = require("../models");

async function seedBookings() {
    try {
        await sequelize.authenticate();

        const existingCount = await Booking.count();
        if (existingCount > 0) {
            console.log("⏭️  Bookings already exist — skipping");
            process.exit(0);
        }

        // get all guests
        const guests = await Guest.findAll();
        const g = {};
        guests.forEach(guest => { g[`${guest.Firstname}_${guest.Lastname}`] = guest; });

        // get all rooms
        const rooms = await Room.findAll({ include: RoomType });
        const r = {};
        rooms.forEach(room => { r[room.roomNumber] = room; });

        // get all services
        const services = await Service.findAll();
        const s = {};
        services.forEach(service => { s[service.name] = service; });

        // helper to calculate total price
        const calcPrice = (room, checkIn, checkOut, bookedServices = []) => {
            const nights = Math.ceil(
                (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
            );
            const roomPrice = room.RoomType?.price || 0;
            let total = roomPrice * nights;
            bookedServices.forEach(({ service, quantity }) => {
                total += service.price * quantity;
            });
            return { total, nights };
        };

       const bookings = [
    // ── DECEMBER 2025 ─────────────────────────────────────────────
    {
        guest: g["James_Wilson"],
        room:  r["101"],
        checkIn: "2025-12-01", checkOut: "2025-12-05",
        status: "checked-out",
        services: [
            { service: s["Breakfast"],   quantity: 4 },
            { service: s["Room Service"], quantity: 2 },
        ],
    },
    {
        guest: g["Sarah_Johnson"],
        room:  r["201"],
        checkIn: "2025-12-10", checkOut: "2025-12-15",
        status: "checked-out",
        services: [
            { service: s["Spa"],       quantity: 2 },
            { service: s["Breakfast"], quantity: 5 },
        ],
    },
    {
        guest: g["Michael_Brown"],
        room:  r["401"],
        checkIn: "2025-12-20", checkOut: "2025-12-26",
        status: "checked-out",
        services: [
            { service: s["Airport Pickup"], quantity: 1 },
            { service: s["Spa"],            quantity: 3 },
        ],
    },

    // ── JANUARY 2026 ──────────────────────────────────────────────
    {
        guest: g["Emily_Davis"],
        room:  r["301"],
        checkIn: "2026-01-03", checkOut: "2026-01-07",
        status: "checked-out",
        services: [
            { service: s["Laundry"],    quantity: 2 },
            { service: s["Gym Access"], quantity: 4 },
        ],
    },
    {
        guest: g["Robert_Martinez"],
        room:  r["203"],
        checkIn: "2026-01-15", checkOut: "2026-01-18",
        status: "checked-out",
        services: [
            { service: s["Room Service"], quantity: 3 },
            { service: s["Breakfast"],    quantity: 3 },
        ],
    },
    {
        guest: g["Linda_Anderson"],
        room:  r["402"],
        checkIn: "2026-01-20", checkOut: "2026-01-25",
        status: "checked-out",
        services: [
            { service: s["Spa"],       quantity: 2 },
            { service: s["Breakfast"], quantity: 5 },
        ],
    },

    // ── FEBRUARY 2026 ─────────────────────────────────────────────
    {
        guest: g["David_Taylor"],
        room:  r["102"],
        checkIn: "2026-02-01", checkOut: "2026-02-05",
        status: "checked-out",
        services: [
            { service: s["Breakfast"],  quantity: 4 },
            { service: s["Gym Access"], quantity: 4 },
        ],
    },
    {
        guest: g["Jennifer_Thomas"],
        room:  r["302"],
        checkIn: "2026-02-10", checkOut: "2026-02-14",
        status: "checked-out",
        services: [
            { service: s["Spa"],            quantity: 2 },
            { service: s["Airport Pickup"], quantity: 1 },
        ],
    },
    {
        guest: g["William_Jackson"],
        room:  r["202"],
        checkIn: "2026-02-20", checkOut: "2026-02-24",
        status: "checked-out",
        services: [
            { service: s["Room Service"], quantity: 4 },
            { service: s["Laundry"],      quantity: 2 },
        ],
    },

    // ── MARCH 2026 ────────────────────────────────────────────────
    {
        guest: g["Patricia_White"],
        room:  r["403"],
        checkIn: "2026-03-02", checkOut: "2026-03-06",
        status: "checked-out",
        services: [
            { service: s["Breakfast"],   quantity: 4 },
            { service: s["Room Service"], quantity: 2 },
        ],
    },
    {
        guest: g["Charles_Harris"],
        room:  r["103"],
        checkIn: "2026-03-12", checkOut: "2026-03-15",
        status: "checked-out",
        services: [
            { service: s["Gym Access"], quantity: 3 },
        ],
    },
    {
        guest: g["Barbara_Clark"],
        room:  r["303"],
        checkIn: "2026-03-20", checkOut: "2026-03-25",
        status: "checked-out",
        services: [
            { service: s["Spa"],       quantity: 3 },
            { service: s["Breakfast"], quantity: 5 },
        ],
    },

    // ── APRIL 2026 ────────────────────────────────────────────────
    {
        guest: g["James_Wilson"],
        room:  r["401"],
        checkIn: "2026-04-01", checkOut: "2026-04-06",
        status: "checked-out",
        services: [
            { service: s["Spa"],            quantity: 2 },
            { service: s["Airport Pickup"], quantity: 1 },
            { service: s["Breakfast"],      quantity: 5 },
        ],
    },
    {
        guest: g["Sarah_Johnson"],
        room:  r["204"],
        checkIn: "2026-04-10", checkOut: "2026-04-13",
        status: "checked-out",
        services: [
            { service: s["Laundry"],     quantity: 1 },
            { service: s["Room Service"], quantity: 3 },
        ],
    },
    {
        guest: g["Michael_Brown"],
        room:  r["102"],
        checkIn: "2026-04-18", checkOut: "2026-04-22",
        status: "checked-out",
        services: [
            { service: s["Breakfast"],  quantity: 4 },
            { service: s["Gym Access"], quantity: 4 },
        ],
    },
    {
        guest: g["Emily_Davis"],
        room:  r["301"],
        checkIn: "2026-04-25", checkOut: "2026-04-28",
        status: "cancelled",
        services: [],
    },

    // ── MAY 2026 ──────────────────────────────────────────────────
    {
        guest: g["Robert_Martinez"],
        room:  r["402"],
        checkIn: "2026-05-01", checkOut: "2026-05-06",
        status: "checked-out",
        services: [
            { service: s["Spa"],       quantity: 3 },
            { service: s["Breakfast"], quantity: 5 },
        ],
    },
    {
        guest: g["Linda_Anderson"],
        room:  r["203"],
        checkIn: "2026-05-08", checkOut: "2026-05-11",
        status: "checked-out",
        services: [
            { service: s["Room Service"], quantity: 3 },
            { service: s["Laundry"],      quantity: 1 },
        ],
    },
    {
        guest: g["David_Taylor"],
        room:  r["302"],
        checkIn: "2026-05-12", checkOut: "2026-05-15",
        status: "checked-out",
        services: [
            { service: s["Breakfast"],  quantity: 3 },
            { service: s["Gym Access"], quantity: 3 },
        ],
    },

    // ── CURRENT — CHECKED IN (May 2026) ───────────────────────────
    {
        guest: g["Jennifer_Thomas"],
        room:  r["201"],
        checkIn: "2026-05-20", checkOut: "2026-05-28",
        status: "checked-in",
        services: [
            { service: s["Breakfast"],   quantity: 8 },
            { service: s["Room Service"], quantity: 4 },
        ],
    },
    {
        guest: g["William_Jackson"],
        room:  r["401"],
        checkIn: "2026-05-22", checkOut: "2026-05-26",
        status: "checked-in",
        services: [
            { service: s["Spa"],       quantity: 2 },
            { service: s["Breakfast"], quantity: 4 },
        ],
    },
    {
        guest: g["Patricia_White"],
        room:  r["303"],
        checkIn: "2026-05-21", checkOut: "2026-05-25",
        status: "checked-in",
        services: [
            { service: s["Laundry"],    quantity: 1 },
            { service: s["Gym Access"], quantity: 4 },
        ],
    },

    // ── UPCOMING — CONFIRMED ──────────────────────────────────────
    {
        guest: g["Charles_Harris"],
        room:  r["301"],
        checkIn: "2026-06-01", checkOut: "2026-06-05",
        status: "confirmed",
        services: [
            { service: s["Airport Pickup"], quantity: 1 },
            { service: s["Breakfast"],      quantity: 4 },
        ],
    },
    {
        guest: g["Barbara_Clark"],
        room:  r["403"],
        checkIn: "2026-06-10", checkOut: "2026-06-15",
        status: "confirmed",
        services: [
            { service: s["Spa"],       quantity: 3 },
            { service: s["Breakfast"], quantity: 5 },
        ],
    },
    {
        guest: g["James_Wilson"],
        room:  r["204"],
        checkIn: "2026-06-20", checkOut: "2026-06-23",
        status: "confirmed",
        services: [],
    },

    // ── UPCOMING — PENDING ────────────────────────────────────────
    {
        guest: g["Sarah_Johnson"],
        room:  r["102"],
        checkIn: "2026-07-01", checkOut: "2026-07-05",
        status: "pending",
        services: [
            { service: s["Breakfast"],  quantity: 4 },
            { service: s["Gym Access"], quantity: 4 },
        ],
    },
    {
        guest: g["Michael_Brown"],
        room:  r["202"],
        checkIn: "2026-07-10", checkOut: "2026-07-14",
        status: "pending",
        services: [
            { service: s["Spa"],            quantity: 2 },
            { service: s["Airport Pickup"], quantity: 1 },
        ],
    },
    {
        guest: g["Emily_Davis"],
        room:  r["103"],
        checkIn: "2026-07-20", checkOut: "2026-07-25",
        status: "pending",
        services: [
            { service: s["Room Service"], quantity: 5 },
            { service: s["Laundry"],      quantity: 2 },
        ],
    },
    {
        guest: g["Robert_Martinez"],
        room:  r["205"],
        checkIn: "2026-08-01", checkOut: "2026-08-04",
        status: "pending",
        services: [],
    },
    {
        guest: g["Linda_Anderson"],
        room:  r["103"],
        checkIn: "2026-08-10", checkOut: "2026-08-13",
        status: "pending",
        services: [
            { service: s["Breakfast"], quantity: 3 },
        ],
    },
];

        // create all bookings
        for (const b of bookings) {
            if (!b.guest || !b.room) {
                console.log(`⚠️  Skipping — missing guest or room`);
                continue;
            }

            const { total, nights } = calcPrice(b.room, b.checkIn, b.checkOut, b.services);

            const newBooking = await Booking.create({
                guestId:      b.guest.id,
                roomId:       b.room.id,
                checkInDate:  b.checkIn,
                checkOutDate: b.checkOut,
                totalPrice:   total,
                status:       b.status,
            });

            // create booking services
            if (b.services.length > 0) {
                await BookingService.bulkCreate(
                    b.services.map(({ service, quantity }) => ({
                        bookingId: newBooking.id,
                        serviceId: service.id,
                        quantity,
                    }))
                );
            }

            // update room status for active bookings
            if (b.status === "checked-in") {
                await b.room.update({ status: "occupied" });
            }

            console.log(`✅ Booking: ${b.guest.Firstname} → Room ${b.room.roomNumber} | ${b.checkIn} → ${b.checkOut} | $${total} | ${b.status}`);
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Booking seeder failed:", error);
        process.exit(1);
    }
}
seedBookings();