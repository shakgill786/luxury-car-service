'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      // PostgreSQL-specific schema creation
      await queryInterface.sequelize.query('CREATE SCHEMA IF NOT EXISTS luxury_schema;');
    }
    // For SQLite, skip schema creation
  },

  down: async (queryInterface, Sequelize) => {
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP SCHEMA IF EXISTS luxury_schema CASCADE;');
    }
    // For SQLite, skip schema dropping
  }
};
