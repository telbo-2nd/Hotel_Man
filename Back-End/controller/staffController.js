const staffService = require('../services/staffService');

exports.findAllStaff = async (req, res, next) => {
    try {
        const data = await staffService.findAllStaff(req.query);
        res.status(200).json({ message: 'Staff retrieved', ...data });
    } catch (error) {
        next(error);
    }
};

exports.findStaffById = async (req, res, next) => {
    try {
        const staff = await staffService.findStaffById(req.params.id);
        res.status(200).json({ message: 'Staff member found', staff });
    } catch (error) {
        next(error);
    }
};

exports.registerStaff = async (req, res, next) => {
    try {
        const staff = await staffService.registerStaff(req.body);
        res.status(201).json({ message: 'Staff member registered', staff });
    } catch (error) {
        next(error);
    }
};

exports.updateStaff = async (req, res, next) => {
    try {
        const staff = await staffService.updateStaff(req.params.id, req.body);
        res.status(200).json({ message: 'Staff member updated', staff });
    } catch (error) {
        next(error);
    }
};

exports.terminateStaff = async (req, res, next) => {
    try {
        const result = await staffService.terminateStaff(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.resetStaffPassword = async (req, res, next) => {
    try {
        const result = await staffService.resetStaffPassword(
            req.params.id,
            req.body.newPassword
        );
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};