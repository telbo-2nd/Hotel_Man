const { Op } = require("sequelize");
const AppError = require("../utils/AppError");
const { RoomType } = require("../models");
const { createRoomTypeSchema, updateRoomTypeSchema } = require("../validators/roomTypeValidator");

// Find All
exports.findAllRoomTypes = async (query) => {
    // pagination
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    // filtering
    const where = {};
    const { searchTerm, minPrice, maxPrice, capacity } = query;

    if (searchTerm) {
        where.name = { [Op.like]: `%${searchTerm}%` };
    }

    if (minPrice && maxPrice) {
        where.price = { [Op.between]: [Number(minPrice), Number(maxPrice)] };
    } else if (minPrice) {
        where.price = { [Op.gte]: Number(minPrice) };
    } else if (maxPrice) {
        where.price = { [Op.lte]: Number(maxPrice) };
    }

    if (capacity) {
        where.capacity = Number(capacity);
    }

    const { count: total, rows: roomTypes } = await RoomType.findAndCountAll({
        limit,
        offset: skip,
        where,
        order: [["createdAt", "DESC"], ["name", "ASC"]],
        attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    return {
        roomTypes,
        totalPages: Math.ceil(total / limit),
        page,
        limit,
        total,
    };
};

// Find By Id
exports.findRoomTypeById = async (id) => {
    const roomType = await RoomType.findByPk(id, {
        attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (!roomType) throw new AppError("Room type not found", 404);
    return roomType;
};

// Create
exports.createNewRoomType = async (data) => {
    // validate
    const { error, value } = createRoomTypeSchema.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((e) => e.message);
        throw new AppError(errors.join(", "), 400);
    }

    // check duplicate name
    const existingRoomType = await RoomType.findOne({ where: { name: value.name } });
    if (existingRoomType) throw new AppError("Room type with this name already exists", 409);

    const newRoomType = await RoomType.create(value);
    return newRoomType;
};

// Update
exports.updateRoomTypeById = async (id, data) => {
    // validate
    const { error, value } = updateRoomTypeSchema.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((e) => e.message);
        throw new AppError(errors.join(", "), 400);
    }

    const roomType = await RoomType.findByPk(id);
    if (!roomType) throw new AppError("Room type not found", 404);

    // check duplicate name if name is being updated
    if (value.name) {
        const existingRoomType = await RoomType.findOne({ where: { name: value.name } });
        if (existingRoomType && existingRoomType.id !== id) {
            throw new AppError("Room type with this name already exists", 409);
        }
    }

    const updatedRoomType = await roomType.update(value);
    return updatedRoomType;
};

// Delete
exports.deleteRoomTypeById = async (id) => {
    const roomType = await RoomType.findByPk(id);
    if (!roomType) throw new AppError("Room type not found", 404);

    // if rooms are using this type, Sequelize will throw SequelizeForeignKeyConstraintError
    // the errorMiddleware will catch it automatically as a 500
    // but i give a cleaner message here
    try {
        await roomType.destroy();
    } catch (err) {
        if (err.name === "SequelizeForeignKeyConstraintError") {
            throw new AppError("Cannot delete room type that is assigned to rooms", 409);
        }
        throw err;
    }
};