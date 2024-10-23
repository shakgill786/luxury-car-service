'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Spot has many SpotImages
      Spot.hasMany(models.SpotImage, { 
        foreignKey: 'spotId', 
        onDelete: 'CASCADE', 
        hooks: true 
      });

      // Spot can have many Reviews
      Spot.hasMany(models.Review, { 
        foreignKey: 'spotId', 
        onDelete: 'CASCADE', 
        hooks: true 
      });

      // Spot belongs to a User (owner)
      Spot.belongsTo(models.User, { 
        foreignKey: 'ownerId', 
        as: 'Owner' 
      });

      // Spot can have many Bookings
      Spot.hasMany(models.Booking, { 
        foreignKey: 'spotId', 
        onDelete: 'CASCADE', 
        hooks: true 
      });
    }
  }

  Spot.init(
    {
      ownerId: DataTypes.INTEGER,
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      country: DataTypes.STRING,
      lat: DataTypes.FLOAT,
      lng: DataTypes.FLOAT,
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'Spot',
    }
  );

  return Spot;
};
