require("dotenv").config();
const { sequelize } = require("../models");

async function runAllSeeders() {
    try {
        console.log("\n🌱 Starting all seeders...\n");

        await require("./adminSeeder").seedAdmin?.()       .catch(() => require("./adminSeeder"));
        
        console.log("\n--- Room Types ---");
        await import("./roomTypeSeeder");

        console.log("\n--- Rooms ---");
        await import("./roomSeeder");

        console.log("\n--- Services ---");
        await import("./serviceSeeder");

        console.log("\n--- Guests ---");
        await import("./guestSeeder");

        console.log("\n--- Receptionists ---");
        await import("./receptionistSeeder");

        console.log("\n--- Bookings ---");
        await import("./bookingSeeder");

        console.log("\n✅ All seeders completed!");
    } catch (error) {
        console.error("❌ Seeder failed:", error);
        process.exit(1);
    }
}

runAllSeeders();