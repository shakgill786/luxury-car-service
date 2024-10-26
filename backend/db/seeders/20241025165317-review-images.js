'use strict';

const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Define schema for production
}
options.tableName = 'ReviewImages';


/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Retrieve review IDs dynamically from the Reviews table
    const reviews = await queryInterface.sequelize.query(
      `SELECT id FROM "Reviews" ORDER BY id ASC;`
    );

    const reviewIds = reviews[0]; // Extract the array of review IDs

    await queryInterface.bulkInsert('ReviewImages', [
      {
        reviewId: reviewIds[0].id, // First review ID
        url: 'https://example.com/review1.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        reviewId: reviewIds[1].id, // Second review ID
        url: 'https://example.com/review2.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        reviewId: reviewIds[2].id, // Third review ID
        url: 'https://example.com/review3.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(options,'ReviewImages', null, {});
  },
};
