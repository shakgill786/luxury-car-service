'use strict';

const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Define schema for production
}
options.tableName = 'SpotImages'; // Ensure correct table name in options

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const spots = await queryInterface.sequelize.query(
      `SELECT id FROM "${options.schema ? `${options.schema}.` : ''}Spots" ORDER BY id ASC;`
    );

    const spotIds = spots[0];

    if (spotIds.length < 3) {
      throw new Error('Not enough spots found to seed SpotImage data.');
    }

    await queryInterface.bulkInsert(options, [
      {
        spotId: spotIds[0].id,
        url: 'https://example.com/spot1.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: spotIds[1].id,
        url: 'https://example.com/spot2.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: spotIds[2].id,
        url: 'https://example.com/spot3.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(options, null, {});
  },
};
