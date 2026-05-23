const Joi = require("joi");

exports.createGuestSchema = Joi.object({
    Firstname: Joi.string().trim().min(2).max(50).required(),
    Lastname: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().trim().required(),
    nationalId: Joi.string().trim().required(),
});

exports.updateGuestSchema = Joi.object({
    Firstname: Joi.string().trim().min(2).max(50).optional(),
    Lastname: Joi.string().trim().min(2).max(50).optional(),
    phone: Joi.string().trim().optional(),
    email: Joi.string().email().optional(),
});