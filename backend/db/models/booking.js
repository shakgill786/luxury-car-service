// models/booking.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Spots', key: 'id' },
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  }, 
  {
    schema: 'luxury_schema' // Corrected the placement of the schema option
  });

  Booking.associate = function (models) {
    Booking.belongsTo(models.Spot, { foreignKey: 'spotId' });
    Booking.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Booking;
};
