const staffStatusService = require("../services/staffStatusService");

exports.changeStatus = async (req, res, next) => {
    try {
        const { status, notes } = req.body;
        const userId = req.user.id;
        const result = await staffStatusService.changeStatus(userId, status, notes);

        // emit socket event
        const io = req.app.get("io");
        io.to("admins").emit("staff:status-changed", {
            userId:    result.user.id,
            Firstname: result.user.Firstname,
            Lastname:  result.user.Lastname,
            status:    status,
            startedAt: result.record.startedAt,
        });

        res.status(200).json({ message: "Status updated", ...result });
    } catch (error) {
        next(error);
    }
};

exports.getCurrentStatus = async (req, res, next) => {
    try {
        const record = await staffStatusService.getCurrentStatus(req.user.id);
        res.status(200).json({ message: "Current status", record });
    } catch (error) {
        next(error);
    }
};

exports.getAllActiveStatuses = async (req, res, next) => {
    try {
        const records = await staffStatusService.getAllActiveStatuses();
        res.status(200).json({ message: "All active statuses", records });
    } catch (error) {
        next(error);
    }
};

exports.getStatusHistory = async (req, res, next) => {
    try {
        const { date } = req.query;
        const userId = req.params.userId || req.user.id;
        const records = await staffStatusService.getStatusHistory(userId, date);
        res.status(200).json({ message: "Status history", records });
    } catch (error) {
        next(error);
    }
};