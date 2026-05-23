require("dotenv").config();
const { Room, RoomType, sequelize } = require("../models");

async function seedRooms() {
    try {
        await sequelize.authenticate();

        // get room type ids dynamically
        const single  = await RoomType.findOne({ where: { name: "Single"  } });
        const double  = await RoomType.findOne({ where: { name: "Double"  } });
        const twin    = await RoomType.findOne({ where: { name: "Twin"    } });
        const suite   = await RoomType.findOne({ where: { name: "Suite"   } });
        const deluxe  = await RoomType.findOne({ where: { name: "Deluxe"  } });

        if (!single || !double || !twin || !suite || !deluxe) {
            console.error("❌ Room types not found — run roomTypeSeeder first");
            process.exit(1);
        }

        const rooms = [
            // floor 1 — singles
            { roomNumber: "101", floor: 1, roomTypeId: single.id,  status: "available"   },
            { roomNumber: "102", floor: 1, roomTypeId: single.id,  status: "available"   },
            { roomNumber: "103", floor: 1, roomTypeId: single.id,  status: "maintenance" },

            // floor 2 — doubles & twins
            { roomNumber: "201", floor: 2, roomTypeId: double.id,  status: "available"   },
            { roomNumber: "202", floor: 2, roomTypeId: double.id,  status: "available"   },
            { roomNumber: "203", floor: 2, roomTypeId: twin.id,    status: "available"   },
            { roomNumber: "204", floor: 2, roomTypeId: twin.id,    status: "occupied"    },

            // floor 3 — deluxe
            { roomNumber: "301", floor: 3, roomTypeId: deluxe.id,  status: "available"   },
            { roomNumber: "302", floor: 3, roomTypeId: deluxe.id,  status: "available"   },

            // floor 4 — suites
            { roomNumber: "401", floor: 4, roomTypeId: suite.id,   status: "available"   },
            { roomNumber: "402", floor: 4, roomTypeId: suite.id,   status: "occupied"    },
        ];

        for (const room of rooms) {
            const existing = await Room.findOne({ where: { roomNumber: room.roomNumber } });
            if (!existing) {
                await Room.create(room);
                console.log(`✅ Room "${room.roomNumber}" created`);
            } else {
                console.log(`⏭️  Room "${room.roomNumber}" already exists — skipping`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Room seeder failed:", error);
        process.exit(1);
    }
}

seedRooms();