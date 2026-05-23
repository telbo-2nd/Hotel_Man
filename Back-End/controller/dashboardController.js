const dashboardService = require("../services/dashboardService");

exports.getAdminDashboard = async (req, res, next) => {
    try {
        const data = await dashboardService.getAdminDashboard();
        res.status(200).json({ message: "Admin dashboard", data });
    } catch (error) {
        next(error);
    }
};

exports.getReceptionistDashboard = async (req, res, next) => {
    try {
        const data = await dashboardService.getReceptionistDashboard();
        res.status(200).json({ message: "Receptionist dashboard", data });
    } catch (error) {
        next(error);
    }
};