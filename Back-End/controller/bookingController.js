const bookingService = require("../services/bookingService");

exports.findAllBookings = async (req, res, next) => {
    try {
        const data = await bookingService.findAllBookings(req.query);
        res.status(200).json({ message: "Bookings found", ...data });
    } catch (error) {
        next(error);
    }
};

exports.findBookingById = async (req, res, next) => {
    try {
        const booking = await bookingService.findBookingById(req.params.id);
        res.status(200).json({ message: "Booking found", booking });
    } catch (error) {
        next(error);
    }
};

exports.createNewBooking = async (req, res, next) => {
    try {
        const booking = await bookingService.createNewBooking(req.body);
        res.status(201).json({ message: "Booking created", booking });
    } catch (error) {
        next(error);
    }
};

exports.updateBookingById = async (req, res, next) => {
    try {
        const booking = await bookingService.updateBookingById(req.params.id, req.body);
        res.status(200).json({ message: "Booking updated", booking });
    } catch (error) {
        next(error);
    }
};

exports.deleteBookingById = async (req, res, next) => {
    try {
        await bookingService.deleteBookingById(req.params.id);
        res.status(200).json({ message: "Booking deleted" });
    } catch (error) {
        next(error);
    }
};