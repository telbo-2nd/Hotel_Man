require("dotenv").config();
const { HotelConfig, sequelize } = require("../models");

async function seedHotelConfig() {
    try {
        await sequelize.authenticate();

        const configs = [
            {
                key: "hotel_name",
                value: "Grand Palace Hotel",
                description: "The name of the hotel",
            },
            {
                key: "hotel_floors",
                value: "4",
                description: "Total number of floors in the hotel",
            },
            {
                key: "currency",
                value: "USD",
                description: "Default currency for all payments",
            },
            {
                key: "max_booking_days",
                value: "30",
                description: "Maximum number of nights allowed per booking",
            },
            {
                key: "check_in_time",
                value: "14:00",
                description: "Official check-in time (24hr format)",
            },
            {
                key: "check_out_time",
                value: "11:00",
                description: "Official check-out time (24hr format)",
            },
        ];

        for (const config of configs) {
            const existing = await HotelConfig.findOne({ where: { key: config.key } });
            if (!existing) {
                await HotelConfig.create(config);
                console.log(`✅ Config "${config.key}" = "${config.value}" created`);
            } else {
                console.log(`⏭️  Config "${config.key}" already exists — skipping`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ HotelConfig seeder failed:", error);
        process.exit(1);
    }
}

seedHotelConfig();