const { User } = require('../models/User');
const { Op } = require('sequelize');
const AppError = require('../utils/AppError');
const { registerStaffSchema, updateStaffSchema } = require('../validators/staffValidator');

const SAFE_ATTRIBUTES = { exclude: ['password', 'deletedAt'] };

function validate(schema, data) {
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
        const msg = error.details.map((d) => d.message).join(', ');
        throw new AppError(msg, 400);
    }
    return value;
}

exports.findAllStaff = async (query) => {
    const page   = Math.max(parseInt(query.page)  || 1, 1);
    const limit  = Math.min(parseInt(query.limit) || 10, 100);
    const offset = (page - 1) * limit;

    const where = {};

    if (query.search) {
        where[Op.or] = [
            { Firstname:  { [Op.like]: `%${query.search}%` } }, // ✅ fixed iLike → like
            { Lastname:   { [Op.like]: `%${query.search}%` } },
            { email:      { [Op.like]: `%${query.search}%` } },
        ];
    }

    if (query.role)             where.role             = query.role;
    if (query.employmentStatus) where.employmentStatus = query.employmentStatus;

    const { count, rows } = await User.findAndCountAll({
        where,
        attributes: SAFE_ATTRIBUTES,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
    });

    return {
        staff:      rows,
        total:      count,
        page,
        totalPages: Math.ceil(count / limit),
    };
};

exports.findStaffById = async (id) => {
    const staff = await User.findByPk(id, { attributes: SAFE_ATTRIBUTES });
    if (!staff) throw new AppError('Staff member not found', 404);
    return staff;
};

exports.registerStaff = async (data) => {
    const value = validate(registerStaffSchema, data);

    const [byEmail, byNationalId] = await Promise.all([
        User.findOne({ where: { email: value.email } }),
        User.findOne({ where: { nationalId: value.nationalId } }),
    ]);
    if (byEmail)      throw new AppError('Email already in use', 409);
    if (byNationalId) throw new AppError('National ID already registered', 409);

    if (!value.specializations) value.specializations = [];

    const staff = await User.create(value);
    const { password, ...safe } = staff.toJSON();
    return safe;
};

exports.updateStaff = async (id, data) => {
    const staff = await User.findByPk(id);
    if (!staff) throw new AppError('Staff member not found', 404);
    if (staff.employmentStatus === 'terminated')
        throw new AppError('Cannot update a terminated staff member', 400);

    const value = validate(updateStaffSchema, data);

    if (typeof value.specializations === 'string') {
        value.specializations = value.specializations
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
    }

    if (!value.specializations) value.specializations = [];

    await staff.update(value);
    const { password, ...safe } = staff.toJSON();
    return safe;
};

exports.terminateStaff = async (id) => {
    const staff = await User.findByPk(id);
    if (!staff) throw new AppError('Staff member not found', 404);
    if (staff.employmentStatus === 'terminated')
        throw new AppError('Staff member is already terminated', 400);

    await staff.update({
        employmentStatus: 'terminated',
        auxStatus:        'off_duty',
        terminatedAt:     new Date(),
    });

    return { message: 'Staff member terminated successfully' };
};