const Joi = require("joi");

exports.createRoomSchema = Joi.object({
    roomNumber: Joi.string().trim().min(1).max(10).required(),
    floor: Joi.number().integer().min(0).required(), // ← fixed: removed .positive() to allow ground floor
    roomTypeId: Joi.string().uuid().required(),
    status: Joi.string().valid("available", "occupied", "maintenance").default("available"),
});

exports.updateRoomSchema = Joi.object({
    roomNumber: Joi.string().trim().min(1).max(10).optional(),
    floor: Joi.number().integer().min(0).optional(), // ← fixed
    roomTypeId: Joi.string().uuid().optional(),
    status: Joi.string().valid("available", "occupied", "maintenance").optional(),
});