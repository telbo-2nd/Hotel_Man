const { sequelize } = require('../config/dbConfig');
const { DataTypes } = require('sequelize');

const Guest = sequelize.define('Guest', {
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
    nationalId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: true,
    indexes: [
        { fields: ['email'] },
        { fields: ['phone'] },
        { fields: ['nationalId'], unique: true },
    ]
});

module.exports = { Guest };