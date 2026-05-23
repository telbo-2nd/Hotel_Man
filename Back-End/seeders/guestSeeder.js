require("dotenv").config();
const { Guest, sequelize } = require("../models");

async function seedGuests() {
    try {
        await sequelize.authenticate();

        const guests = [
            { Firstname: "James",   Lastname: "Wilson",   email: "james.wilson@email.com",   phone: "01011111111", nationalId: "29801011234561" },
            { Firstname: "Sarah",   Lastname: "Johnson",  email: "sarah.johnson@email.com",  phone: "01022222222", nationalId: "29801011234562" },
            { Firstname: "Michael", Lastname: "Brown",    email: "michael.brown@email.com",  phone: "01033333333", nationalId: "29801011234563" },
            { Firstname: "Emily",   Lastname: "Davis",    email: "emily.davis@email.com",    phone: "01044444444", nationalId: "29801011234564" },
            { Firstname: "Robert",  Lastname: "Martinez", email: "robert.martinez@email.com",phone: "01055555555", nationalId: "29801011234565" },
            { Firstname: "Linda",   Lastname: "Anderson", email: "linda.anderson@email.com", phone: "01066666666", nationalId: "29801011234566" },
        ];

        for (const guest of guests) {
            const existing = await Guest.findOne({ where: { nationalId: guest.nationalId } });
            if (!existing) {
                await Guest.create(guest);
                console.log(`✅ Guest "${guest.Firstname} ${guest.Lastname}" created`);
            } else {
                console.log(`⏭️  Guest "${guest.Firstname} ${guest.Lastname}" already exists — skipping`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Guest seeder failed:", error);
        process.exit(1);
    }
}

seedGuests();