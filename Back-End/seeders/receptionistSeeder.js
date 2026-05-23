require("dotenv").config();
const { User, sequelize } = require("../models");

async function seedReceptionists() {
    try {
        await sequelize.authenticate();

        const receptionists = [
            { Firstname: "Ahmed", Lastname: "Hassan", email: "ahmed@hotel.com", password: "123456", role: "receptionist", nationalId: "11111111111", phone: "1111111111" },
            { Firstname: "Nour", Lastname: "El-Din", email: "nour@hotel.com", password: "123456", role: "receptionist", nationalId: "22222222222", phone: "2222222222" },
        ];

        for (const r of receptionists) {
            const existing = await User.findOne({ where: { email: r.email } });
            if (!existing) {
                await User.create(r); // hook hashes password
                console.log(`✅ Receptionist "${r.Firstname} ${r.Lastname}" created`);
            } else {
                console.log(`⏭️  "${r.Firstname} ${r.Lastname}" already exists — skipping`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Receptionist seeder failed:", error);
        process.exit(1);
    }
}

seedReceptionists();