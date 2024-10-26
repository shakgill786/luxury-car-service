'use strict';

const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Define schema for production
}
options.tableName = 'SpotImage';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Retrieve spot IDs dynamically from the Spots table
    const spots = await queryInterface.sequelize.query(
      `SELECT id FROM "Spots" ORDER BY id ASC;`
    );

    const spotIds = spots[0]; // Extract the array of spot IDs

    await queryInterface.bulkInsert('SpotImages', [
      {
        spotId: spotIds[0].id, // First spot ID
        url: 'https://example.com/spot1.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: spotIds[1].id, // Second spot ID
        url: 'https://example.com/spot2.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: spotIds[2].id, // Third spot ID
        url: 'https://example.com/spot3.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(options,'SpotImage', null, {});
  },
};
