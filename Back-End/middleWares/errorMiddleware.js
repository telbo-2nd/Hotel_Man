const AppError = require("../utils/AppError");

const errorMiddleware = (error, request, response, next) => {
    
    // Default to 500 if no statusCode set
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Internal Server Error";

    // Sequelize Validation Error
    if (error.name === "SequelizeValidationError") {
        const messages = error.errors.map((e) => e.message);
        return response.status(400).json({ message: "Validation Error", errors: messages });
    }

    // Sequelize Unique Constraint Error
    if (error.name === "SequelizeUniqueConstraintError") {
        const messages = error.errors.map((e) => e.message);
        return response.status(409).json({ message: "Duplicate Entry", errors: messages });
    }

    // JWT Errors
    if (error.name === "JsonWebTokenError") {
        return response.status(401).json({ message: "Invalid Token" });
    }
    if (error.name === "TokenExpiredError") {
        return response.status(401).json({ message: "Token Expired" });
    }

    // Operational errors (our AppError throws)
    if (error.isOperational) {
        return response.status(error.statusCode).json({ message: error.message });
    }

    // Unknown/unexpected errors (should not leak details in production)
    console.error(" UNEXPECTED ERROR:", error);
    return response.status(500).json({ message: "Internal Server Error" });
};

module.exports = errorMiddleware;