const cron = require("node-cron");
const { Op } = require("sequelize");
const { Booking, Guest, Room, RoomType } = require("../models");
const emailService = require("./emailService");
const { getConfig } = require("./hotelConfigService");

// runs every day at 10:00 AM
cron.schedule("0 10 * * *", async () => {
    console.log("⏰ Running check-in reminder job...");

    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const tomorrowStart = new Date(tomorrow.setHours(0, 0, 0, 0));
        const tomorrowEnd   = new Date(tomorrow.setHours(23, 59, 59, 999));

        // find all confirmed bookings checking in tomorrow
        const bookings = await Booking.findAll({
            where: {
                status: "confirmed",
                checkInDate: {
                    [Op.between]: [tomorrowStart, tomorrowEnd],
                },
            },
            include: [
                { model: Guest },
                {
                    model: Room,
                    include: { model: RoomType },
                },
            ],
        });

        if (bookings.length === 0) {
            console.log("📭 No check-ins tomorrow");
            return;
        }

        const checkInTime = await getConfig("check_in_time");

        for (const booking of bookings) {
            await emailService.sendCheckInReminder(
                booking.Guest,
                booking,
                booking.Room,
                booking.Room.RoomType,
                checkInTime
            );
        }

        console.log(`✅ Sent ${bookings.length} check-in reminder(s)`);
    } catch (error) {
        console.error("❌ Reminder job failed:", error);
    }
});

console.log("✅ Reminder scheduler started");