const hotelConfigService = require("../services/hotelConfigService");

exports.getAllConfigs = async (req, res, next) => {
    try {
        const configs = await hotelConfigService.getAllConfigs();
        res.status(200).json({ message: "Hotel configs found", configs });
    } catch (error) {
        next(error);
    }
};

exports.updateConfig = async (req, res, next) => {
    try {
        const config = await hotelConfigService.updateConfig(req.body);
        res.status(200).json({ message: "Config updated", config });
    } catch (error) {
        next(error);
    }
};