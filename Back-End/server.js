const express    = require("express");
const cors       = require("cors");
const http       = require("http");
const { Server } = require("socket.io");
const dotenv     = require("dotenv");
dotenv.config();

const { connectToDB } = require("./models");
const errorMiddleware = require("./middlewares/errorMiddleware");
const jwt            = require("jsonwebtoken");

const app    = express();
const server = http.createServer(app); 
const PORT   = process.env.PORT ?? 3000;

const io = new Server(server, {
    cors: {
        origin:      process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    },
});

app.set("io", io);

// ── Socket auth middleware ───────────────────────────────────────────────────
io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = user;
        next();
    } catch {
        next(new Error("Invalid token"));
    }
});


io.on("connection", (socket) => {
    const user = socket.user;
    console.log(`🔌 ${user.name} connected — role: ${user.role}`);

    // admins join a special room to receive all status broadcasts
    if (user.role === "admin") {
        socket.join("admins");
        console.log(`👑 ${user.name} joined admins room`);
    }

    // staff join their own room for targeted messages
    socket.join(`user:${user.id}`);

    // broadcast to admins that this staff member came online
    socket.to("admins").emit("staff:online", {
        userId:    user.id,
        name:      user.name,
        role:      user.role,
        timestamp: new Date(),
    });

    socket.on("disconnect", () => {
        console.log(`❌ ${user.name} disconnected`);
        // broadcast to admins
        socket.to("admins").emit("staff:offline", {
            userId:    user.id,
            name:      user.name,
            timestamp: new Date(),
        });
    });
});

app.use(cors({
    origin:      process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());


app.use("/api/v1/auth",         require("./routes/authRoute"));
app.use("/api/v1/guests",       require("./routes/guestRoute"));
app.use("/api/v1/rooms",        require("./routes/roomRoutes"));
app.use("/api/v1/room-types",   require("./routes/roomTypeRoutes"));
app.use("/api/v1/services",     require("./routes/serviceRoutes"));
app.use("/api/v1/bookings",     require("./routes/bookingRoutes"));
app.use("/api/v1/hotel-config", require("./routes/hotelConfigRoutes"));
app.use("/api/v1/dashboard",    require("./routes/dashboardRoutes"));
app.use("/api/v1/staff",        require("./routes/staffRoutes"));
app.use("/api/v1/staff-status", require("./routes/staffStatusRoutes")); 


app.use(errorMiddleware);


connectToDB();
require("./services/reminderService");

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));