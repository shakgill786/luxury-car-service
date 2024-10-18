'use strict';

const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error('Cannot be an email.');
            }
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: true,
        },
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60],
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
    }, 
    {
      schema: 'luxury_schema' // Corrected the placement of the schema option
    });

  User.associate = (models) => {
    // User can create multiple spots
    User.hasMany(models.Spot, { foreignKey: 'ownerId', onDelete: 'CASCADE' });

    // User can leave multiple reviews
    User.hasMany(models.Review, { foreignKey: 'userId', onDelete: 'CASCADE' });

    // User can have multiple bookings
    User.hasMany(models.Booking, { foreignKey: 'userId', onDelete: 'CASCADE' });
  };
  return User;
};
