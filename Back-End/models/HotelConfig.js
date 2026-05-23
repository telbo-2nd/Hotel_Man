const { sequelize } = require("../config/dbConfig");
const { DataTypes } = require("sequelize");

const HotelConfig = sequelize.define("HotelConfig", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    key: {
        type: DataTypes.ENUM(
            "hotel_name",
            "hotel_floors",
            "currency",
            "max_booking_days",
            "check_in_time",
            "check_out_time"
        ),
        allowNull: false,
        unique: true,
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
});

module.exports = { HotelConfig };