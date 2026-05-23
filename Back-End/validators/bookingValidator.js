const Joi = require("joi");

exports.createBookingSchema = Joi.object({
    checkInDate: Joi.date().iso().required(),
    checkOutDate: Joi.date().iso().required(),
    guestId: Joi.string().uuid().required(),
    roomId: Joi.string().uuid().required(),
    services: Joi.array().items(
        Joi.object({
            serviceId: Joi.string().uuid().required(),
            quantity: Joi.number().integer().min(1).default(1),
        })
    ).optional().default([]),
});

exports.updateBookingSchema = Joi.object({
    status: Joi.string()
        .valid("pending", "confirmed", "checked-in", "checked-out", "cancelled")
        .required(),
});