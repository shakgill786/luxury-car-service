// models/spotImage.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const SpotImage = sequelize.define('SpotImage', {
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preview: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Spots', key: 'id' },
      onDelete: 'CASCADE',
    },
  }, 
  {
    schema: 'luxury_schema' // Corrected the placement of the schema option
  });
  SpotImage.associate = function (models) {
    SpotImage.belongsTo(models.Spot, { foreignKey: 'spotId' });
  };

  return SpotImage;
};
