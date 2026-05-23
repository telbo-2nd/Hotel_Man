import api from "./axios";

export const getBookings      = (params)   => api.get("/bookings", { params });
export const getBookingById   = (id)       => api.get(`/bookings/${id}`);
export const createBooking    = (data)     => api.post("/bookings", data);
export const updateBooking    = (id, data) => api.patch(`/bookings/${id}`, data);
export const deleteBooking    = (id)       => api.delete(`/bookings/${id}`);