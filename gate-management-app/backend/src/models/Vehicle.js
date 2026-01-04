const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehicle = sequelize.define(
  'Vehicle',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    license_plate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    driver_name: {
      type: DataTypes.STRING
    },
    cargo_name: {
      type: DataTypes.STRING
    },
    checkin_time: {
      type: DataTypes.DATE
    },
        checkout_time: {
        type: DataTypes.DATE
    },
    image_url: {
      type: DataTypes.STRING
    },
    transaction_type: {
        type: DataTypes.ENUM('IN', 'OUT'),
        allowNull: false
    },
    checkin_image: {
        type: DataTypes.STRING
    },
    checkout_image: {
        type: DataTypes.STRING
    }
  },
  {
    tableName: 'vehicles',
    timestamps: false
  }
);

module.exports = Vehicle;
