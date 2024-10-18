'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // Add schema only for production
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'Users',  // Table name
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        username: {
          type: Sequelize.STRING(30),
          allowNull: false,
          unique: true,
        },
        email: {
          type: Sequelize.STRING(256),
          allowNull: false,
          unique: true,
        },
        hashedPassword: {
          type: Sequelize.STRING.BINARY,
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
      },
      options  // Pass the options object here
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';  // Specify the table name in options
    await queryInterface.dropTable('Users', options);  // Drop the table with schema options
  },
};
