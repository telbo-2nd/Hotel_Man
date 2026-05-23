const serviceService = require("../services/serviceService");

exports.findAllServices = async (req, res, next) => {
    try {
        const data = await serviceService.findAllServices(req.query);
        res.status(200).json({ message: "Services found", ...data });
    } catch (error) {
        next(error);
    }
};

exports.findServiceById = async (req, res, next) => {
    try {
        const service = await serviceService.findServiceById(req.params.id);
        res.status(200).json({ message: "Service found", service });
    } catch (error) {
        next(error);
    }
};

exports.createNewService = async (req, res, next) => {
    try {
        const service = await serviceService.createNewService(req.body);
        res.status(201).json({ message: "Service created", service });
    } catch (error) {
        next(error);
    }
};

exports.updateServiceById = async (req, res, next) => {
    try {
        const service = await serviceService.updateServiceById(req.params.id, req.body);
        res.status(200).json({ message: "Service updated", service });
    } catch (error) {
        next(error);
    }
};

exports.deleteServiceById = async (req, res, next) => {
    try {
        await serviceService.deleteServiceById(req.params.id);
        res.status(200).json({ message: "Service deleted" });
    } catch (error) {
        next(error);
    }
};