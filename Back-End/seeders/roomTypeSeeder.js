require("dotenv").config();
const { RoomType, sequelize } = require("../models");

async function seedRoomTypes() {
    try {
        await sequelize.authenticate();

        const roomTypes = [
            { name: "Single",  price: 50,  capacity: 1 },
            { name: "Double",  price: 100, capacity: 2 },
            { name: "Twin",    price: 90,  capacity: 2 },
            { name: "Suite",   price: 250, capacity: 4 },
            { name: "Deluxe",  price: 180, capacity: 3 },
        ];

        for (const roomType of roomTypes) {
            const existing = await RoomType.findOne({ where: { name: roomType.name } });
            if (!existing) {
                await RoomType.create(roomType);
                console.log(`✅ Room type "${roomType.name}" created`);
            } else {
                console.log(`⏭️  Room type "${roomType.name}" already exists — skipping`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ RoomType seeder failed:", error);
        process.exit(1);
    }
}

seedRoomTypes();