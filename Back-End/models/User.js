const { sequelize } = require('../config/dbConfig');
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = sequelize.define('User', {

    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    Firstname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Lastname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nationalId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    role: {
        type: DataTypes.ENUM('admin', 'receptionist'),
        defaultValue: 'receptionist',
    },
    jobTitle: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    joinDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: DataTypes.NOW,
    },
    salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },

    // employmentStatus  → "active" | "terminated"  (hard HR state)
    employmentStatus: {
        type: DataTypes.ENUM('active', 'terminated'),
        defaultValue: 'active',
    },
    // auxStatus → real-time shift state
    auxStatus: {
        type: DataTypes.ENUM('working', 'break', 'management', 'off_duty', 'on_leave'),
        defaultValue: 'working',
    },
    terminatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },

    // ── Schedule ──────────────────────────────────────────────────────────────
    // Store as JSON array of { day, startTime, endTime }
    // e.g. [{ day: "MON", startTime: "08:00", endTime: "16:00" }, ...]
    schedule: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
    },
    auxStatusChangedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },

    specializations: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
    },

    profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
    },

}, {
    timestamps: true,

    paranoid: true,         
    hooks: {
        beforeCreate: async (user) => {
            user.password = await bcrypt.hash(
                user.password,
                parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
            );
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(
                    user.password,
                    parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
                );
            }
        },
    },
});

// ── Instance methods ──────────────────────────────────────────────────────────

User.prototype.generateToken = function () {
    return jwt.sign(
        {
            id:   this.id,
            role: this.role,
            name: `${this.Firstname} ${this.Lastname}`,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

// Safe public view — never expose password
User.prototype.toPublic = function () {
    const { password, ...rest } = this.toJSON();
    return rest;
};

module.exports = { User };