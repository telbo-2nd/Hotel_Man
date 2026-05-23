const { Op, fn, col, literal } = require("sequelize");
const { Booking, Guest, Room, RoomType, Service, BookingService, sequelize } = require("../models");

// ─── Admin Dashboard ────────────────────────────────────────────────────────

exports.getAdminDashboard = async () => {

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // 1. Revenue
    const totalRevenueResult = await Booking.sum("totalPrice", {
        where: { status: { [Op.notIn]: ["cancelled", "pending"] } },
    });

    const monthlyRevenueResult = await Booking.sum("totalPrice", {
        where: {
            status: { [Op.notIn]: ["cancelled", "pending"] },
            createdAt: { [Op.between]: [startOfMonth, endOfMonth] },
        },
    });

    // 2. Bookings by status 
    const bookingsByStatus = await Booking.findAll({
        attributes: [
            "status",
            [fn("COUNT", col("id")), "count"],
        ],
        group: ["status"],
        raw: true,
    });

    const totalBookings = bookingsByStatus.reduce((sum, b) => sum + Number(b.count), 0);

    // 3. Rooms overview
    const roomsByStatus = await Room.findAll({
        attributes: [
            "status",
            [fn("COUNT", col("id")), "count"],
        ],
        group: ["status"],
        raw: true,
    });

    const totalRooms     = await Room.count();
    const occupiedRooms  = roomsByStatus.find((r) => r.status === "occupied")?.count  || 0;
    const occupancyRate  = totalRooms > 0
        ? ((occupiedRooms / totalRooms) * 100).toFixed(1)
        : 0;

    // 4. Total guests
    const totalGuests = await Guest.count();

    // 5. Most booked room type by number of bookings
    // fix mostBookedRoomType
    const mostBookedRoomType = await sequelize.query(`
        SELECT 
            rt.id,
            rt.name AS name,
            COUNT(b.id) AS bookingCount
        FROM Bookings b
        INNER JOIN Rooms r ON b.roomId = r.id
        INNER JOIN RoomTypes rt ON r.roomTypeId = rt.id
        GROUP BY rt.id, rt.name
        ORDER BY bookingCount DESC
        LIMIT 1
    `, { type: sequelize.QueryTypes.SELECT });
    console.log("mostBookedRoomType raw:", mostBookedRoomType);

    // mostRequestedService
    const mostRequestedService = await sequelize.query(`
        SELECT 
            s.id,
            s.name AS name,
            SUM(bs.quantity) AS totalQuantity
        FROM Services s
        INNER JOIN BookingServices bs ON s.id = bs.serviceId
        GROUP BY s.id, s.name
        ORDER BY totalQuantity DESC
        LIMIT 1
    `, { type: sequelize.QueryTypes.SELECT });
    console.log("mostRequestedService raw:", mostRequestedService);

    // 7. Revenue last 6 months
    const revenueByMonth = [];

    for (let i = 5; i >= 0; i--) {
        const date  = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end   = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

        const revenue = await Booking.sum("totalPrice", {
            where: {
                status: { [Op.notIn]: ["cancelled", "pending"] },
                createdAt: { [Op.between]: [start, end] },
            },
        });

        revenueByMonth.push({
            month: date.toLocaleString("default", { month: "short", year: "numeric" }),
            revenue: revenue || 0,
        });
    }

    // 8. Recent bookings (last 5) 

    const recentBookings = await Booking.findAll({
        limit: 5,
        order: [["createdAt", "DESC"]],
        include: [
            {
                model: Guest,
                attributes: ["Firstname", "Lastname", "email"],
            },
            {
                model: Room,
                attributes: ["roomNumber", "floor"],
                include: {
                    model: RoomType,
                    attributes: ["name", "price"],
                },
            },
        ],
    });

    return {
        revenue: {
            allTime:   totalRevenueResult  || 0,
            thisMonth: monthlyRevenueResult || 0,
        },
        bookings: {
            total:    totalBookings,
            byStatus: bookingsByStatus,
        },
        rooms: {
            total:         totalRooms,
            byStatus:      roomsByStatus,
            occupancyRate: `${occupancyRate}%`,
        },
        guests: {
            total: totalGuests,
        },
        mostBookedRoomType: mostBookedRoomType[0]
            ? {
                name:         mostBookedRoomType[0].name,  
                bookingCount: mostBookedRoomType[0].bookingCount,
            }
            : null,
        mostRequestedService: mostRequestedService[0]
            ? {
                name:          mostRequestedService[0].name,
                totalQuantity: Number(mostRequestedService[0].totalQuantity),
            }
            : null,
        revenueByMonth,
        recentBookings,
    };

};

// ─── Receptionist Dashboard ─────────────────────────────────────────────────

exports.getReceptionistDashboard = async () => {

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,  0,  0);
    const todayEnd   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    // 1. Today's check-ins 
    // confirmed bookings whose checkInDate is today
    const todayCheckIns = await Booking.findAll({
        where: {
            status: "confirmed",
            checkInDate: { [Op.between]: [todayStart, todayEnd] },
        },
        include: [
            {
                model: Guest,
                attributes: ["Firstname", "Lastname", "email", "phone", "nationalId"],
            },
            {
                model: Room,
                attributes: ["roomNumber", "floor"],
                include: {
                    model: RoomType,
                    attributes: ["name", "capacity"],
                },
            },
            {
                model: Service,
                attributes: ["name", "price"],
                through: { attributes: ["quantity"] },
            },
        ],
    });

    // 2. Today's check-outs 
    // checked-in bookings whose checkOutDate is today
    const todayCheckOuts = await Booking.findAll({
        where: {
            status: "checked-in",
            checkOutDate: { [Op.between]: [todayStart, todayEnd] },
        },
        include: [
            {
                model: Guest,
                attributes: ["Firstname", "Lastname", "email", "phone"],
            },
            {
                model: Room,
                attributes: ["roomNumber", "floor"],
                include: {
                    model: RoomType,
                    attributes: ["name", "price"],
                },
            },
            {
                model: Service,
                attributes: ["name", "price"],
                through: { attributes: ["quantity"] },
            },
        ],
    });

    // 3. Available rooms count
    const availableRooms = await Room.count({
        where: { status: "available" },
    });

    // 4. Pending bookings 
    const pendingBookings = await Booking.findAll({
        where: { status: "pending" },
        include: [
            {
                model: Guest,
                attributes: ["Firstname", "Lastname", "email", "phone"],
            },
            {
                model: Room,
                attributes: ["roomNumber", "floor"],
                include: {
                    model: RoomType,
                    attributes: ["name"],
                },
            },
        ],
        order: [["checkInDate", "ASC"]],
    });

    // 5. Currently occupied rooms 
    const occupiedRooms = await Booking.findAll({
        where: { status: "checked-in" },
        include: [
            {
                model: Guest,
                attributes: ["Firstname", "Lastname", "phone"],
            },
            {
                model: Room,
                attributes: ["roomNumber", "floor"],
                include: {
                    model: RoomType,
                    attributes: ["name"],
                },
            },
        ],
        order: [["checkOutDate", "ASC"]], 
    });
        
    return {
        today: now.toDateString(),
        checkIns: {
            count:    todayCheckIns.length,
            bookings: todayCheckIns,
        },
        checkOuts: {
            count:    todayCheckOuts.length,
            bookings: todayCheckOuts,
        },
        availableRooms,
        pendingBookings: {
            count:    pendingBookings.length,
            bookings: pendingBookings,
        },
        occupiedRooms: {
            count:    occupiedRooms.length,
            bookings: occupiedRooms,
        },
    };
};