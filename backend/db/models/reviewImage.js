// models/ReviewImage.js
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
  },options);

  ReviewImage.associate = (models) => {
    ReviewImage.belongsTo(models.Review, { foreignKey: 'reviewId' });
  };

  return ReviewImage;
};
