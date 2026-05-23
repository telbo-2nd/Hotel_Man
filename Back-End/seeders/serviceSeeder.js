require("dotenv").config();
const { Service, sequelize } = require("../models");

async function seedServices() {
    try {
        await sequelize.authenticate();

        const services = [
            { name: "Room Service",   description: "Food and beverages delivered to your room",     price: 20  },
            { name: "Laundry",        description: "Clothes cleaned, pressed and delivered",         price: 15  },
            { name: "Spa",            description: "Full body massage and wellness treatment",        price: 80  },
            { name: "Airport Pickup", description: "Private car transfer from airport to hotel",     price: 50  },
            { name: "Breakfast",      description: "Full buffet breakfast served in the restaurant", price: 25  },
            { name: "Gym Access",     description: "Full day access to hotel gym and pool",          price: 10  },
        ];

        for (const service of services) {
            const existing = await Service.findOne({ where: { name: service.name } });
            if (!existing) {
                await Service.create(service);
                console.log(`✅ Service "${service.name}" created`);
            } else {
                console.log(`⏭️  Service "${service.name}" already exists — skipping`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Service seeder failed:", error);
        process.exit(1);
    }
}

seedServices();
