const Joi = require("joi");

exports.createRoomTypeSchema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    price: Joi.number().positive().required(),
    capacity: Joi.number().integer().min(1).required(),
});

exports.updateRoomTypeSchema = Joi.object({
    name: Joi.string().trim().min(2).max(50).optional(),
    price: Joi.number().positive().optional(),
    capacity: Joi.number().integer().min(1).optional(),
});