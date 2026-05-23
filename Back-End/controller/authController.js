const authService = require("../services/authService");

exports.register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const data = await authService.login(req.body);
        res.status(200).json({ message: "Login successful", ...data });
    } catch (error) {
        next(error);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await authService.getMe(req.user.id);
        res.status(200).json({ message: "User details", user });
    } catch (error) {
        next(error);
    }
};

// any authenticated user — own password only
exports.changePassword = async (req, res, next) => {
    try {
        await authService.changePassword(req.user.id, req.body);
        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        next(error);
    }
};

// admin only — any user by id
exports.resetUserPassword = async (req, res, next) => {
    try {
        await authService.resetUserPassword(req.params.userId, req.body);
        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        next(error);
    }
};