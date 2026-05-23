# 🏨 GrandStay Pro — Hotel Management System

A full-stack hotel management platform built with **React, Node.js, Express, Sequelize, and MySQL**.  
Designed for hotel staff to manage guests, rooms, bookings, services, and real-time staff operations from a single interface.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based login with secure token storage
- Role-based access control (Admin / Receptionist)
- Password change and admin-initiated password reset
- Protected routes on both frontend and backend

### 👤 User Roles

| Role | Access |
|------|--------|
| **Admin** | Full system access including staff, rooms, room types, services, and all reports |
| **Receptionist** | Guest management, bookings, available rooms, and personal profile |

---

### 🧑‍🤝‍🧑 Guest Management
- Register, edit, and delete guests
- Search by name, email, or national ID
- Pagination support
- View full guest profile with booking history and total spend

---

### 🏨 Room Management *(Admin only)*
- Add, edit, and delete rooms
- Filter by status (available, occupied, maintenance) and floor
- Search by room number
- Paginated grid view with color-coded room type borders
- Real-time status tracking (available / occupied / maintenance)

---

### 🏷️ Room Types Management *(Admin only)*
- Create and manage room types (Single, Double, Twin, Suite, Deluxe)
- Set capacity and nightly price per type
- Filter by price range and capacity

---

### 📅 Room Availability
- Search available rooms by check-in/check-out dates
- Filter by guest capacity, room type, and price range
- Visual room cards with photos, pricing, and stay total
- One-click "Book Now" that pre-fills the booking form

---

### 📦 Bookings
- Multi-step booking creation (Dates & Room → Guest → Services)
- Auto price calculation (room rate × nights + services)
- Date overlap validation to prevent double-booking
- Status lifecycle: `pending → confirmed → checked-in → checked-out`
- Cancellation support with room auto-release
- Filter bookings by status with tab navigation
- Delete cancelled bookings

### Booking Details Page
- Full booking summary with guest and room info
- Additional services table
- Payment summary with grand total
- Status action buttons with transition rules (check-in only allowed on check-in day)

---

### 🛎️ Services Management *(Admin only)*
- Create and manage hotel services (e.g. room service, spa, airport transfer)
- Set pricing and availability per service
- Attach services to bookings with quantity selection

---

### 👨‍💼 Staff Management *(Admin only)*
- Register staff with role (admin / receptionist)
- View full staff profile: employment info, contact, schedule, specializations
- Edit profile, reset password, deactivate account
- Weekly schedule builder with shift management
- Real-time online/offline indicator per staff member
- Live aux status display (Working, On Break, Management, Off Duty, On Leave)
- Status timer showing how long current status has been active

---

### 👤 Staff Profile (Self)
- View and manage personal profile
- Change password
- Switch current aux status in real-time
- Today's activity timeline showing all status changes with durations
- Live connection indicator (socket online/offline)

---

### 📊 Admin Dashboard
- Total revenue (all time + current month)
- Occupancy rate and room status breakdown
- Total guests registered
- Bookings by status (pending, confirmed, checked-in, checked-out, cancelled)
- Revenue bar chart for last 6 months (color-coded bars per month)
- Best performing room type and trending service
- Recent bookings log

---

### 🖥️ Receptionist Dashboard
- Today's expected check-ins with full guest and room details
- Today's expected check-outs
- Currently occupied rooms with guest info
- Pending bookings awaiting confirmation
- Available rooms count

---

### 📧 Email Notifications
- Booking created email (pending status with reservation details)
- Booking confirmation email (on status → confirmed)
- Cancellation email
- Invoice email on check-out (itemized room + services)
- Check-in reminder (sent day before arrival)

---

### 🔴 Real-Time Features (Socket.io)
- Live staff online/offline presence tracking
- Real-time aux status updates pushed to admin
- Status timer updates across all connected clients
- Admin sees live staff status without page refresh

---

### 🏗️ Hotel Configuration *(Admin only)*
- Set hotel-wide settings: max booking days, check-out time, number of floors
- Configuration used throughout booking validation and emails

---

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router v6
- TanStack Query (React Query) for data fetching and caching
- React Hook Form for form management
- Tailwind CSS for styling
- Recharts for dashboard charts
- Lucide React for icons
- Socket.io Client for real-time features
- React Hot Toast for notifications
- Axios for HTTP requests

### Backend
- Node.js + Express.js
- Sequelize ORM
- MySQL
- JWT (Authentication)
- bcrypt (Password hashing)
- Joi (Request validation)
- Nodemailer (Email service)
- Socket.io (Real-time communication)

---

## 📁 Project Structure

```
├── client/                     # React frontend
│   ├── src/
│   │   ├── api/                # Axios API calls per module
│   │   ├── components/
│   │   │   └── ui/             # Reusable UI components
│   │   │       ├── booking/    # Booking-specific components
│   │   │       ├── guest/      # Guest-specific components
│   │   │       ├── room/       # Room-specific components
│   │   │       ├── staff/      # Staff-specific components
│   │   │       └── availableRooms/
│   │   ├── context/            # AuthContext, SocketContext
│   │   ├── hooks/              # Custom React Query hooks
│   │   ├── pages/              # Page components
│   │   │   ├── Dashboard/
│   │   │   ├── Guests/
│   │   │   ├── Rooms/
│   │   │   ├── RoomTypes/
│   │   │   ├── Bookings/
│   │   │   ├── AvailableRooms/
│   │   │   ├── Services/
│   │   │   ├── Staff/
│   │   │   └── Profile/
│   │   ├── routes/             # ProtectedRoute, AdminRoute
│   │   └── utils/              # formatCurrency, formatDate
│
└── server/                     # Node.js backend
    ├── config/                 # DB config
    ├── controller/             # Route controllers
    ├── middleWares/            # Auth, role middleware
    ├── models/                 # Sequelize models
    ├── routes/                 # Express routers
    ├── services/               # Business logic
    ├── utils/                  # AppError, helpers
    └── validators/             # Joi schemas
```

---

## 🔒 Role Permissions

| Module          | Admin | Receptionist |
|-----------------|-------|--------------|
| Guests          | ✔     | ✔            |
| Rooms           | ✔     | ❌           |
| Room Types      | ✔     | ❌           |
| Services        | ✔     | ❌           |
| Bookings        | ✔     | ✔            |
| Available Rooms | ✔     | ✔            |
| Staff           | ✔     | ❌           |
| Profile (self)  | ✔     | ✔            |
| Admin Dashboard | ✔     | ❌           |
| Receptionist Dashboard | ❌ | ✔          |
| Hotel Config    | ✔     | ❌           |

---

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/telbo-2nd/Hotel_Man.git
cd GPH
```

### 2. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Configure environment variables

Create a `.env` file in the `server/` directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hotel_db

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your@email.com
EMAIL_PASS=your_email_password
EMAIL_FROM=your@email.com

CLIENT_URL=http://localhost:5173
PORT=3000
```

### 4. Run the project

```bash
# Start backend
cd server
npm run dev

# Start frontend
cd client
npm run dev
```

---

## 📌 API Overview

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/v1/auth/login` | Public |
| GET | `/api/v1/auth/me` | All |
| PATCH | `/api/v1/auth/change-password` | All |

### Guests
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/v1/guests` | All |
| GET | `/api/v1/guests/:id` | All |
| POST | `/api/v1/guests` | All |
| PATCH | `/api/v1/guests/:id` | All |
| DELETE | `/api/v1/guests/:id` | All |

### Rooms
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/v1/rooms` | All |
| GET | `/api/v1/rooms/available` | All |
| GET | `/api/v1/rooms/:id` | All |
| POST | `/api/v1/rooms` | Admin |
| PATCH | `/api/v1/rooms/:id` | Admin |
| DELETE | `/api/v1/rooms/:id` | Admin |

### Bookings
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/v1/bookings` | All |
| GET | `/api/v1/bookings/:id` | All |
| POST | `/api/v1/bookings` | All |
| PATCH | `/api/v1/bookings/:id` | All |
| DELETE | `/api/v1/bookings/:id` | Admin |

---

## 🧠 Key Technical Decisions

- **Component decomposition** — every page is split into focused, reusable components stored under `components/ui/<module>/`
- **Optimistic UI** — React Query invalidates and refetches on every mutation keeping UI in sync
- **Date overlap detection** — booking conflict check uses SQL range intersection logic (`checkIn < otherCheckOut AND checkOut > otterCheckIn`)
- **Real-time presence** — Socket.io tracks connected staff IDs server-side and broadcasts status changes to all admin clients
- **Email resilience** — all email sends are wrapped in try/catch so a mail failure never crashes a booking operation

---

## 📷 Future Improvements

- Payment gateway integration (Stripe)
- Swagger / OpenAPI documentation
- Unit and integration testing (Jest + Supertest)
- Docker support
- Multi-language support (i18n)
- Mobile app (React Native)

---

## 👨‍💻 Author

**Abdelrahman Kamel**  
Computer Science Student | Full-Stack Developer  
Node.js · React · MySQL · Sequelize · Socket.io