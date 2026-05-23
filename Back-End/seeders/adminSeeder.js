require("dotenv").config();
const { User, sequelize } = require("../models");

async function seedAdmin() {
    try {
        await sequelize.authenticate();
        console.log("DB connected");

        const existingAdmin = await User.findOne({ where: { email: "admin@hotel.com" } });
        if (existingAdmin) {
            console.log("Admin already exists — skipping");
            process.exit(0);
        }

        // ✅ pass plain password — beforeCreate hook will hash it
        await User.create({
            Firstname: "Super",
            Lastname: "Admin",
            email: "admin@hotel.com",
            password: "adminpass",
            role: "admin",
            nationalId: "00000000000",
            phone: "0000000000"
        });

        console.log("✅ Admin created successfully");
        console.log("Email:    admin@hotel.com");
        console.log("Password: adminpass");
        console.log("⚠️  Change this password after first login!");
        process.exit(0);

    } catch (error) {
        console.error("❌ Seeder failed:", error);
        process.exit(1);
    }
}

seedAdmin();