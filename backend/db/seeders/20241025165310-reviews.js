'use strict';

const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Define schema for production
}
options.tableName = 'Reviews'; // Ensure correct table name in options

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "${options.schema ? `${options.schema}.` : ''}Users" ORDER BY id ASC;`
    );

    const spots = await queryInterface.sequelize.query(
      `SELECT id FROM "${options.schema ? `${options.schema}.` : ''}Spots" ORDER BY id ASC;`
    );

    const userIds = users[0];
    const spotIds = spots[0];

    if (userIds.length < 3 || spotIds.length < 3) {
      throw new Error('Not enough users or spots found to seed Reviews data.');
    }

    await queryInterface.bulkInsert(options, [
      {
        userId: userIds[0].id,
        spotId: spotIds[0].id,
        review: 'Amazing villa with breathtaking ocean views!',
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: userIds[1].id,
        spotId: spotIds[1].id,
        review: 'A cozy apartment, perfect location but slightly noisy.',
        stars: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: userIds[2].id,
        spotId: spotIds[2].id,
        review: 'Great experience, but the cabin could use some upgrades.',
        stars: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(options, null, {});
  },
};
