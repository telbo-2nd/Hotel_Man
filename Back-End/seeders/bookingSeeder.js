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

        // get guests
        const james   = await Guest.findOne({ where: { email: "james.wilson@email.com"   } });
        const sarah   = await Guest.findOne({ where: { email: "sarah.johnson@email.com"  } });
        const michael = await Guest.findOne({ where: { email: "michael.brown@email.com"  } });
        const emily   = await Guest.findOne({ where: { email: "emily.davis@email.com"    } });

        // get rooms
        const room101 = await Room.findOne({ where: { roomNumber: "101" } });
        const room201 = await Room.findOne({ where: { roomNumber: "201" } });
        const room301 = await Room.findOne({ where: { roomNumber: "301" } });
        const room401 = await Room.findOne({ where: { roomNumber: "401" } });

        // get services
        const roomService   = await Service.findOne({ where: { name: "Room Service"   } });
        const breakfast     = await Service.findOne({ where: { name: "Breakfast"      } });
        const spa           = await Service.findOne({ where: { name: "Spa"            } });
        const airportPickup = await Service.findOne({ where: { name: "Airport Pickup" } });

        // get room types for price
        const getRoomPrice = async (room) => {
            const roomWithType = await Room.findByPk(room.id, { include: RoomType });
            return roomWithType.RoomType.price;
        };

        const bookings = [
            // past booking — checked out
            {
                guest: james, room: room101,
                checkInDate: "2026-04-01", checkOutDate: "2026-04-05",
                status: "checked-out",
                services: [
                    { service: breakfast,   quantity: 4 },
                    { service: roomService, quantity: 2 },
                ],
            },
            // current booking — checked in
            {
                guest: sarah, room: room201,
                checkInDate: "2026-05-15", checkOutDate: "2026-05-22",
                status: "checked-in",
                services: [
                    { service: spa,         quantity: 1 },
                    { service: breakfast,   quantity: 7 },
                ],
            },
            // upcoming — confirmed
            {
                guest: michael, room: room301,
                checkInDate: "2026-06-01", checkOutDate: "2026-06-04",
                status: "confirmed",
                services: [
                    { service: airportPickup, quantity: 1 },
                ],
            },
            // upcoming — pending
            {
                guest: emily, room: room401,
                checkInDate: "2026-06-10", checkOutDate: "2026-06-15",
                status: "pending",
                services: [],
            },
        ];

        for (const b of bookings) {
            const checkIn  = new Date(b.checkInDate);
            const checkOut = new Date(b.checkOutDate);
            const nights   = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
            const roomPrice = await getRoomPrice(b.room);
            let totalPrice  = roomPrice * nights;

            // calculate services price
            for (const s of b.services) {
                totalPrice += s.service.price * s.quantity;
            }

            const newBooking = await Booking.create({
                guestId:      b.guest.id,
                roomId:       b.room.id,
                checkInDate:  b.checkInDate,
                checkOutDate: b.checkOutDate,
                totalPrice,
                status:       b.status,
            });

            // create booking services
            if (b.services.length > 0) {
                await BookingService.bulkCreate(
                    b.services.map((s) => ({
                        bookingId:  newBooking.id,
                        serviceId:  s.service.id,
                        quantity:   s.quantity,
                    }))
                );
            }

            // update room status for active bookings
            if (b.status === "checked-in" || b.status === "confirmed") {
                await b.room.update({ status: "occupied" });
            }

            console.log(`✅ Booking for "${b.guest.Firstname}" in room "${b.room.roomNumber}" created — ${b.status}`);
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Booking seeder failed:", error);
        process.exit(1);
    }
}

seedBookings();