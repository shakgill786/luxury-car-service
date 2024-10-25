'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // User can create multiple spots
      User.hasMany(models.Spot, { foreignKey: 'ownerId', onDelete: 'CASCADE' });

      // User can leave multiple reviews
      User.hasMany(models.Review, { foreignKey: 'userId', onDelete: 'CASCADE' });

      // User can have multiple bookings
      User.hasMany(models.Booking, { foreignKey: 'userId', onDelete: 'CASCADE' });
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
        type: DataTypes.STRING(60), // Adjusted to 60 for bcrypt hashes
        allowNull: false,
        validate: {
          len: [60, 60],
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 50],
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 50],
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};
