const guestService = require("../services/guestService");

exports.findAllGuests = async (req, res, next) => {
    try {
        const data = await guestService.findAllGuests(req.query);
        res.status(200).json({ message: "Guests found", ...data });
    } catch (error) {
        next(error);
    }
};

exports.findGuestById = async (req, res, next) => {
    try {
        const guest = await guestService.findGuestById(req.params.id);
        res.status(200).json({ message: "Guest found", guest });
    } catch (error) {
        next(error);
    }
};

exports.createNewGuest = async (req, res, next) => {
    try {
        const guest = await guestService.createNewGuest(req.body);
        res.status(201).json({ message: "Guest created", guest });
    } catch (error) {
        next(error);
    }
};

exports.updateGuestById = async (req, res, next) => {
    try {
        const guest = await guestService.updateGuestById(req.params.id, req.body);
        res.status(200).json({ message: "Guest updated", guest });
    } catch (error) {
        next(error);
    }
};

exports.deleteGuestById = async (req, res, next) => {
    try {
        await guestService.deleteGuestById(req.params.id);
        res.status(200).json({ message: "Guest deleted" });
    } catch (error) {
        next(error);
    }
};