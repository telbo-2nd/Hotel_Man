const Joi = require("joi");

const validKeys = [
    "hotel_name",
    "hotel_floors",
    "currency",
    "max_booking_days",
    "check_in_time",
    "check_out_time",
];

// value rules per key
const valueValidation = Joi.alternatives().conditional("key", [
    {
        is: "hotel_floors",
        then: Joi.string()
            .pattern(/^[1-9][0-9]*$/)
            .message("hotel_floors must be a positive integer"),
    },
    {
        is: "max_booking_days",
        then: Joi.string()
            .pattern(/^[1-9][0-9]*$/)
            .message("max_booking_days must be a positive integer"),
    },
    {
        is: "currency",
        then: Joi.string()
            .length(3)
            .uppercase()
            .message("currency must be a 3-letter code e.g. USD, EGP"),
    },
    {
        is: Joi.valid("check_in_time", "check_out_time"),
        then: Joi.string()
            .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
            .message("time must be in HH:MM 24hr format e.g. 14:00"),
    },
    {
        is: "hotel_name",
        then: Joi.string().min(3).max(100),
    },
]);

exports.updateHotelConfigSchema = Joi.object({
    key: Joi.string().valid(...validKeys).required(),
    value: valueValidation.required(),
});