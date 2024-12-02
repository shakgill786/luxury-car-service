'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CarImage extends Model {
    static associate(models) {
      // CarImage belongs to a Car
      CarImage.belongsTo(models.Car, { foreignKey: 'carId' });
    }
  }

  CarImage.init(
    {
      carId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'CarImage',
    }
  );

  return CarImage;
};