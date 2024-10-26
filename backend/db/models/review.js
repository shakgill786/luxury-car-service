'use strict';

module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Spots', key: 'id' },
      onDelete: 'CASCADE',
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5, isInt: true },
    },
  });

  Review.associate = function (models) {
    Review.belongsTo(models.Spot, { foreignKey: 'spotId' });
    Review.belongsTo(models.User, { foreignKey: 'userId' });
    Review.hasMany(models.ReviewImage, { foreignKey: 'reviewId', onDelete: 'CASCADE' });
  };

  return Review;
};
