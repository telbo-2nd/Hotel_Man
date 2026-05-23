const AppError = require("../utils/AppError");
const { HotelConfig } = require("../models");
const { updateHotelConfigSchema } = require("../validators/hotelConfigValidator");

// helper — used by other services (roomService, bookingService)
exports.getConfig = async (key) => {
    const config = await HotelConfig.findOne({ where: { key } });
    if (!config) throw new AppError(`Config "${key}" not found`, 404);
    return config.value;
};

// Get All
exports.getAllConfigs = async () => {
    const configs = await HotelConfig.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    return configs;
};

// Update One
exports.updateConfig = async (data) => {
    const { error, value } = updateHotelConfigSchema.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((e) => e.message);
        throw new AppError(errors.join(", "), 400);
    }

    const config = await HotelConfig.findOne({ where: { key: value.key } });
    if (!config) throw new AppError(`Config "${value.key}" not found`, 404);

    await config.update({ value: value.value });
    return config;
};