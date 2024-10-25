'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Retrieve user IDs and spot IDs dynamically
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" ORDER BY id ASC;`
    );
    const spots = await queryInterface.sequelize.query(
      `SELECT id FROM "Spots" ORDER BY id ASC;`
    );

    const userIds = users[0]; // Extract user IDs array
    const spotIds = spots[0]; // Extract spot IDs array

    await queryInterface.bulkInsert('Reviews', [
      {
        userId: userIds[0].id, // First user ID
        spotId: spotIds[0].id, // First spot ID
        review: 'Amazing villa with breathtaking ocean views!',
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: userIds[1].id, // Second user ID
        spotId: spotIds[1].id, // Second spot ID
        review: 'A cozy apartment, perfect location but slightly noisy.',
        stars: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: userIds[2].id, // Third user ID
        spotId: spotIds[2].id, // Third spot ID
        review: 'Great experience, but the cabin could use some upgrades.',
        stars: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Reviews', null, {});
  },
};
