require("dotenv").config();
const { BookingService, Booking, Guest, Room, RoomType, Service, User, sequelize } = require("../models");

/**
 * Truncates all tables in the correct order (FK constraints respected).
 * Safe to run before re-seeding.
 *
 * Usage:
 *   node seeders/reset.js           ← asks for confirmation in terminal
 *   node seeders/reset.js --force   ← skips confirmation (CI / scripts)
 */
async function resetDatabase() {
    const force = process.argv.includes("--force");

    if (!force) {
        console.log("⚠️  This will DELETE all data in every table.");
        console.log("   Run with --force to confirm:\n");
        console.log("   node seeders/reset.js --force\n");
        process.exit(0);
    }

    try {
        await sequelize.authenticate();
        console.log("🔌 Connected to database\n");

        // Disable FK checks so we can truncate in any order (MySQL)
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

        const tables = [
            { model: BookingService, name: "BookingServices" },
            { model: Booking,        name: "Bookings"        },
            { model: Guest,          name: "Guests"          },
            { model: Room,           name: "Rooms"           },
            { model: RoomType,       name: "RoomTypes"       },
            { model: Service,        name: "Services"        },
            { model: User,           name: "Users"           },
        ];

        for (const { model, name } of tables) {
            await model.destroy({ where: {}, truncate: true, force: true });
            console.log(`🗑️  Cleared: ${name}`);
        }

        // Re-enable FK checks
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

        console.log("\n✅ All tables cleared — ready to seed");
        process.exit(0);
    } catch (error) {
        console.error("❌ Reset failed:", error);
        process.exit(1);
    }
}

resetDatabase();