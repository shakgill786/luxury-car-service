'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      Spot.hasMany(models.SpotImage, { foreignKey: 'spotId', onDelete: 'CASCADE' });
      Spot.hasMany(models.Review, { foreignKey: 'spotId', onDelete: 'CASCADE' });
      Spot.belongsTo(models.User, { foreignKey: 'ownerId', as: 'Owner' });
      Spot.hasMany(models.Booking, { foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true });
    }
  }

  Spot.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      lat: {
        type: DataTypes.DECIMAL(10, 8), // Adjusted for higher precision
        allowNull: false,
        validate: { isFloat: true },
      },
      lng: {
        type: DataTypes.DECIMAL(11, 8), // Adjusted for higher precision
        allowNull: false,
        validate: { isFloat: true },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [1, 255] },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { notEmpty: true },
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { isFloat: true, min: 0 },
      },
    },
    {
      sequelize,
      modelName: 'Spot',
    }
  );

  return Spot;
};
