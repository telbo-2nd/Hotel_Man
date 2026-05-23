const roomService = require("../services/roomService");

exports.findAllRooms = async (req, res, next) => {
    try {
        const data = await roomService.findAllRooms(req.query);
        res.status(200).json({ message: "Rooms found", ...data });
    } catch (error) {
        next(error);
    }
};

exports.findRoomById = async (req, res, next) => {
    try {
        const room = await roomService.findRoomById(req.params.id);
        res.status(200).json({ message: "Room found", room });
    } catch (error) {
        next(error);
    }
};

exports.createNewRoom = async (req, res, next) => {
    try {
        const room = await roomService.createNewRoom(req.body);
        res.status(201).json({ message: "Room created", room });
    } catch (error) {
        next(error);
    }
};

exports.updateRoomById = async (req, res, next) => {
    try {
        const room = await roomService.updateRoomById(req.params.id, req.body);
        res.status(200).json({ message: "Room updated", room });
    } catch (error) {
        next(error);
    }
};

exports.deleteRoomById = async (req, res, next) => {
    try {
        await roomService.deleteRoomById(req.params.id);
        res.status(200).json({ message: "Room deleted" });
    } catch (error) {
        next(error);
    }
};

exports.findAvailableRooms = async (req, res, next) => {
    try {
        const data = await roomService.findAvailableRooms(req.query);
        res.status(200).json({ message: "Available rooms found", ...data });
    } catch (error) {
        next(error);
    }
};