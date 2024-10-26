'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Add schema only for production
}
options.tableName = 'Reviews';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      spotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Spots', key: 'id' },
        onDelete: 'CASCADE',
      },
      review: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      stars: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    }, options); // Pass options here
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews'; // Ensure tableName is set for down method
    await queryInterface.dropTable(options);
  },
};
