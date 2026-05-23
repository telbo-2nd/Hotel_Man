const bcrypt = require("bcrypt");
const AppError = require("../utils/AppError");
const { User } = require("../models");
const {
    registerSchema,
    loginSchema,
    resetUserPasswordSchema,
    changePasswordSchema,
} = require("../validators/authValidator");

exports.login = async (data) => {
    const { error, value } = loginSchema.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((e) => e.message);
        throw new AppError(errors.join(", "), 400);
    }
    console.log("Login attempt for email:", value.email);
    
    const user = await User.findOne({ where: { email: value.email } });
    
    if (!user) throw new AppError("Invalid email or password ", 400);

    if (user.employmentStatus === "terminated") throw new AppError("User is terminated", 400);

    console.log(value.password," === ", user.password);
    const isMatch = await bcrypt.compare(value.password, user.password);
    if (!isMatch) throw new AppError("Invalid email or password ", 400);


    const token = user.generateToken();
    return { token };
};

// Get Me
exports.getMe = async (userId) => {
    const user = await User.findByPk(userId, {
        attributes: { exclude: ["password"] },
    });
    if (!user) throw new AppError("User not found", 404);
    return user;
};

// Change My Own Password
exports.changePassword = async (userId, data) => {
    // validate
    const { error, value } = changePasswordSchema.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((e) => e.message);
        throw new AppError(errors.join(", "), 400);
    }

    // find user with password
    const user = await User.findByPk(userId);
    if (!user) throw new AppError("User not found", 404);

    // verify current password is correct
    const isMatch = await bcrypt.compare(value.currentPassword, user.password);
    if (!isMatch) throw new AppError("Current password is incorrect", 400);

    // make sure new password is different
    const isSame = await bcrypt.compare(value.newPassword, user.password);
    if (isSame) throw new AppError("New password must be different from current password", 400);

    // update — model hook hashes it
    await user.update({ password: value.newPassword });
};

// Admin Reset User Password
exports.resetUserPassword = async (userId, data) => {
    const { error, value } = resetUserPasswordSchema.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((e) => e.message);
        throw new AppError(errors.join(", "), 400);
    }

    const user = await User.findByPk(userId);
    if (!user) throw new AppError("User not found", 404);

    await user.update({ password: value.newPassword });
};