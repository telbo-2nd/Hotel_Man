const roomTypeService = require("../services/roomTypeService");

exports.findAllRoomTypes = async (req, res, next) => {
    try {
        const data = await roomTypeService.findAllRoomTypes(req.query);
        res.status(200).json({ message: "Room types found", ...data });
    } catch (error) {
        next(error);
    }
};

exports.findRoomTypeById = async (req, res, next) => {
    try {
        const roomType = await roomTypeService.findRoomTypeById(req.params.id);
        res.status(200).json({ message: "Room type found", roomType });
    } catch (error) {
        next(error);
    }
};

exports.createNewRoomType = async (req, res, next) => {
    try {
        const roomType = await roomTypeService.createNewRoomType(req.body);
        res.status(201).json({ message: "Room type created", roomType });
    } catch (error) {
        next(error);
    }
};

exports.updateRoomTypeById = async (req, res, next) => {
    try {
        const roomType = await roomTypeService.updateRoomTypeById(req.params.id, req.body);
        res.status(200).json({ message: "Room type updated", roomType });
    } catch (error) {
        next(error);
    }
};

exports.deleteRoomTypeById = async (req, res, next) => {
    try {
        await roomTypeService.deleteRoomTypeById(req.params.id);
        res.status(200).json({ message: "Room type deleted" });
    } catch (error) {
        next(error);
    }
};