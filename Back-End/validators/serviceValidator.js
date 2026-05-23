const Joi = require("joi");

exports.createServiceSchema = Joi.object({
    name: Joi.string().trim().min(3).max(50).required(),
    description: Joi.string().trim().min(3).max(200).required(), // ← fixed: required to match model
    price: Joi.number().positive().required(),
    imageUrl:    Joi.string().uri().optional().allow("", null),
    status: Joi.string().valid("available", "unavailable", "maintenance").optional().default("available"),
});

exports.updateServiceSchema = Joi.object({
    name: Joi.string().trim().min(3).max(50).optional(),
    description: Joi.string().trim().min(3).max(200).optional(),
    price: Joi.number().positive().optional(),
    imageUrl:    Joi.string().uri().optional().allow("", null),
    status: Joi.string().valid("available", "unavailable", "maintenance").optional().default("available"),
});