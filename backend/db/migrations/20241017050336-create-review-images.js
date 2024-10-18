'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // Add schema only for production
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ReviewImages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      reviewId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Reviews',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ReviewImages');
  },
};
