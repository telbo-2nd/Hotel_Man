require("dotenv").config();
const { Service, sequelize } = require("../models");

async function seedServices() {
    try {
        await sequelize.authenticate();
        const services = [
            {
                name: "Room Service",
                description: "Food and beverages delivered to your room 24/7",
                price: 20,
                imageUrl: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&auto=format&fit=crop",
            },
            {
                name: "Laundry",
                description: "Clothes cleaned, pressed and delivered within 24 hours",
                price: 15,
                imageUrl: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=400&auto=format&fit=crop",
            },
            {
                name: "Spa",
                description: "Full body massage and wellness treatment by certified therapists",
                price: 80,
                imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&auto=format&fit=crop",
            },
            {
                name: "Airport Pickup",
                description: "Private car transfer from airport to hotel",
                price: 50,
                imageUrl: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&auto=format&fit=crop",
            },
            {
                name: "Breakfast",
                description: "Full buffet breakfast served in the restaurant 7-10 AM",
                price: 25,
                imageUrl: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&auto=format&fit=crop",
            },
            {
                name: "Gym Access",
                description: "Full day access to hotel gym and swimming pool",
                price: 10,
                imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop",
            },
        ];

        for (const service of services) {
            const existing = await Service.findOne({ where: { name: service.name } });
            if (!existing) {
                await Service.create(service);
                console.log(`✅ Service "${service.name}" created`);
            } else {
                console.log(`⏭️  Service "${service.name}" exists`);
            }
        }
        process.exit(0);
    } catch (error) {
        console.error("❌ Service seeder failed:", error);
        process.exit(1);
    }
}
seedServices();