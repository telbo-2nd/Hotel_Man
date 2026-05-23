const { Op } = require("sequelize");
const AppError = require("../utils/AppError");
const { Service } = require("../models");
const { createServiceSchema, updateServiceSchema } = require("../validators/serviceValidator");

// Find All
exports.findAllServices = async (query) => {
    // pagination
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    // filtering
    const where = {};
    const { searchTerm, minPrice, maxPrice } = query;

    if (searchTerm) {
        where[Op.or] = [
            { name:        { [Op.like]: `%${searchTerm}%` } },
            { description: { [Op.like]: `%${searchTerm}%` } },
        ];
    }

    if (minPrice && maxPrice) {
        where.price = { [Op.between]: [Number(minPrice), Number(maxPrice)] };
    } else if (minPrice) {
        where.price = { [Op.gte]: Number(minPrice) };
    } else if (maxPrice) {
        where.price = { [Op.lte]: Number(maxPrice) };
    }

    const { count: total, rows: services } = await Service.findAndCountAll({
        limit,
        offset: skip,
        where,
        order: [["createdAt", "DESC"], ["name", "ASC"]],
        attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    return {
        services,
        totalPages: Math.ceil(total / limit),
        page,
        limit,
        total,
    };
};

// Find By Id
exports.findServiceById = async (id) => {
    const service = await Service.findByPk(id, {
        attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (!service) throw new AppError("Service not found", 404);
    return service;
};

// Create
exports.createNewService = async (data) => {
    // validate
    const { error, value } = createServiceSchema.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((e) => e.message);
        throw new AppError(errors.join(", "), 400);
    }

    // check duplicate name
    const existingService = await Service.findOne({ where: { name: value.name } });
    if (existingService) throw new AppError("Service with this name already exists", 409);

    const newService = await Service.create(value);
    return newService;
};

// Update
exports.updateServiceById = async (id, data) => {
    // validate
    const { error, value } = updateServiceSchema.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((e) => e.message);
        throw new AppError(errors.join(", "), 400);
    }

    const service = await Service.findByPk(id);
    if (!service) throw new AppError("Service not found", 404);

    // check duplicate name if being updated
    if (value.name) {
        const existingService = await Service.findOne({ where: { name: value.name } });
        if (existingService && existingService.id !== id) {
            throw new AppError("Service with this name already exists", 409);
        }
    }

    const updatedService = await service.update(value);
    return updatedService;
};

// Delete
exports.deleteServiceById = async (id) => {
    const service = await Service.findByPk(id);
    if (!service) throw new AppError("Service not found", 404);

    try {
        await service.destroy();
    } catch (err) {
        if (err.name === "SequelizeForeignKeyConstraintError") {
            throw new AppError("Cannot delete a service that is linked to bookings", 409);
        }
        throw err;
    }
};