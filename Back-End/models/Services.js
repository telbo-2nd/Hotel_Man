
const { sequelize } = require("../config/dbConfig");


const { DataTypes } = require("sequelize");

// Create Model
const Service = sequelize.define(
    "Service",
    {
        id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        },

        name: { type: DataTypes.STRING, allowNull: false },

        description: { type: DataTypes.STRING, allowNull: false },

        price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status : {
        type : DataTypes.ENUM('available','unavailable','maintenance'),
        defaultValue : 'available'
    },
    },
    { timestamps: true },
);

// Export
module.exports = { Service };