const { StaffStatus, User } = require("../models");
const AppError = require("../utils/AppError");
const { Op } = require("sequelize");

// Change status 
exports.changeStatus = async (userId, newStatus, notes = null) => {
    const user = await User.findByPk(userId);
    if (!user) throw new AppError("User not found", 404);
    if (user.employmentStatus === "terminated")
        throw new AppError("Terminated staff cannot change status", 400);

    const now = new Date();

    // close the currently active status record
    const activeRecord = await StaffStatus.findOne({
        where: { userId, endedAt: null },
        order: [["startedAt", "DESC"]],
    });

    if (activeRecord) {
        const durationMinutes = Math.round(
            (now - new Date(activeRecord.startedAt)) / (1000 * 60)
        );
        await activeRecord.update({
            endedAt:  now,
            duration: durationMinutes,
        });
    }

    // create new status record
    const newRecord = await StaffStatus.create({
        userId,
        status:    newStatus,
        startedAt: now,
        notes,
    });

    // update user's current auxStatus
    await user.update({ auxStatus: newStatus , auxStatusChangedAt: now });


    return {
        record: newRecord,
        user:   { id: user.id, Firstname: user.Firstname, Lastname: user.Lastname, auxStatus: newStatus, auxStatusChangedAt: now },
    };
};

// Get current active status for a user
exports.getCurrentStatus = async (userId) => {
    const record = await StaffStatus.findOne({
        where:  { userId, endedAt: null },
        order:  [["startedAt", "DESC"]],
    });
    return record;
};

// Get all active statuses for all staff (admin view)
exports.getAllActiveStatuses = async () => {
    const records = await StaffStatus.findAll({
        where: { endedAt: null },
        include: [{
            model: User,
            attributes: ["id", "Firstname", "Lastname", "role", "jobTitle", "profileImage", "employmentStatus"],
        }],
        order: [["startedAt", "ASC"]],
    });
    return records;
};

// Get status history for a user
exports.getStatusHistory = async (userId, date) => {
    const where = { userId };

    if (date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        where.startedAt = { [Op.between]: [start, end] };
    }

    const records = await StaffStatus.findAll({
        where,
        order: [["startedAt", "DESC"]],
    });
    return records;
};