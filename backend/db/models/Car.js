'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    static associate(models) {
      // Car belongs to a User (owner)
      Car.belongsTo(models.User, { foreignKey: 'ownerId' });

      // Car has many CarImages
      Car.hasMany(models.CarImage, { foreignKey: 'carId', onDelete: 'CASCADE', hooks: true });

      // Car has many Reviews
      Car.hasMany(models.Review, { foreignKey: 'carId', onDelete: 'CASCADE', hooks: true });
    }
  }

  Car.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      make: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      model: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Car',
    }
  );

  return Car;
};