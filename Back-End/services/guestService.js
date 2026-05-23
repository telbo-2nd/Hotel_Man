const { Op } = require("sequelize");
const AppError = require("../utils/AppError");
const { Guest } = require("../models");
const { createGuestSchema, updateGuestSchema } = require("../validators/guestValidator");

// Find All
exports.findAllGuests = async (query) => {
    // pagination
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    // filtering
    const where = {};
    const { searchTerm } = query;

    if (searchTerm) {
        where[Op.or] = [
            { Firstname:   { [Op.like]: `%${searchTerm}%` } },
            { Lastname:    { [Op.like]: `%${searchTerm}%` } },
            { phone:       { [Op.like]: `%${searchTerm}%` } },
            { email:       { [Op.like]: `%${searchTerm}%` } },
            { nationalId:  { [Op.like]: `%${searchTerm}%` } },
        ];
    }

    const { count: total, rows: guests } = await Guest.findAndCountAll({
        limit,
        offset: skip,
        where,
        order: [["createdAt", "DESC"], ["Firstname", "ASC"]],
        attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    return {
        guests,
        totalPages: Math.ceil(total / limit),
        page,
        limit,
        total,
    };
};

// Find By Id
exports.findGuestById = async (id) => {
    const guest = await Guest.findByPk(id, {
        attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (!guest) throw new AppError("Guest not found", 404);
    return guest;
};

// Create
exports.createNewGuest = async (data) => {
    // validate
    const { error, value } = createGuestSchema.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((e) => e.message);
        throw new AppError(errors.join(", "), 400);
    }

    // check duplicate nationalId
    const existingGuest = await Guest.findOne({ where: { nationalId: value.nationalId } });
    if (existingGuest) throw new AppError("Guest with this national ID already exists", 409);

    // check duplicate email
    const existingEmail = await Guest.findOne({ where: { email: value.email } });
    if (existingEmail) throw new AppError("Guest with this email already exists", 409);

    const newGuest = await Guest.create(value);
    return newGuest;
};

// Update
exports.updateGuestById = async (id, data) => {
    // validate
    const { error, value } = updateGuestSchema.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((e) => e.message);
        throw new AppError(errors.join(", "), 400);
    }

    const guest = await Guest.findByPk(id);
    if (!guest) throw new AppError("Guest not found", 404);

    const updatedGuest = await guest.update(value);
    return updatedGuest;
};

// Delete
exports.deleteGuestById = async (id) => {
    const guest = await Guest.findByPk(id);
    if (!guest) throw new AppError("Guest not found", 404);
    await guest.destroy();
};