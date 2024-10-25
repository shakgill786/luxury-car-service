'use strict';

module.exports = (sequelize, DataTypes) => {
  const ReviewImage = sequelize.define('ReviewImage', {
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Reviews', key: 'id' },
      onDelete: 'CASCADE',
    },
  });

  ReviewImage.associate = function (models) {
    ReviewImage.belongsTo(models.Review, { foreignKey: 'reviewId', onDelete: 'CASCADE' });
  };

  return ReviewImage;
};
