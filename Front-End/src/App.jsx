import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login/Login";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import ReceptionistDashboard from "./pages/Dashboard/ReceptionistDashboard";
import Guests       from "./pages/Guests/Guests";
import GuestDetails from "./pages/Guests/GuestDetails";
import Rooms     from "./pages/Rooms/Rooms";
import RoomTypes from "./pages/RoomTypes/RoomTypes";
import Services  from "./pages/Services/Services";
import AvailableRooms  from "./pages/AvailableRooms/AvailableRooms";
import Bookings        from "./pages/Bookings/Bookings";
import BookingDetails  from "./pages/Bookings/BookingDetails";
import Staff from "./pages/Staff/Staff";
import StaffDetails from "./pages/Staff/StaffDetails";
import HotelConfig from "./pages/HotelConfig/HotelConfig";
import Profile from "./pages/Profile/Profile";

// inside <Routes>, alongside the /login route (outside the Layout route)

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 1000 * 60 * 5,
        },
    },
});

// temporary placeholder for pages not built yet
const ComingSoon = ({ page }) => (
    <div className="flex items-center justify-center h-64">
        <div className="text-center">
            <h2 className="text-xl font-bold text-gray-700">{page}</h2>
            <p className="text-gray-400 mt-1">Coming soon...</p>
        </div>
    </div>
);

function DashboardRedirect() {
    const { user } = useAuth();
    return user?.role === "admin"
        ? <Navigate to="/dashboard/admin" replace />
        : <Navigate to="/dashboard/receptionist" replace />;
}

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <SocketProvider>
                    <BrowserRouter>
                        <Routes>
                            {/* public */}
                            <Route path="/login" element={<Login />} />
                            {/* protected */}
                            <Route path="/" element={<ProtectedRoute> <Layout /> </ProtectedRoute>}>
                                <Route index element={<DashboardRedirect />} />
                                <Route path="dashboard" element={<DashboardRedirect />} />
                                <Route path="dashboard/admin" element={<AdminDashboard />} />
                                <Route path="dashboard/receptionist" element={<ReceptionistDashboard />} />
                                <Route path="guests" element={<Guests />} />
                                <Route path="guests/:id" element={<GuestDetails />} />
                                <Route path="available-rooms" element={<AvailableRooms />} />
                                <Route path="bookings" element={<Bookings />} />
                                <Route path="bookings/:id" element={<BookingDetails />} />
                                <Route path="rooms" element={<AdminRoute><Rooms /></AdminRoute>} />
                                <Route path="room-types" element={<AdminRoute><RoomTypes /></AdminRoute>} />
                                <Route path="services" element={<AdminRoute><Services /></AdminRoute>} />
                                <Route path="staff" element={<AdminRoute><Staff /></AdminRoute>} />
                                <Route path="staff/:id" element={<AdminRoute><StaffDetails /></AdminRoute>} />
                                <Route path="hotel-config" element={<AdminRoute><HotelConfig /></AdminRoute>} />
                                <Route path="profile" element={<Profile />} />
                            </Route>
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </BrowserRouter>
                </SocketProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}