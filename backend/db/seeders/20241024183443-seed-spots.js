'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Retrieve user IDs dynamically from the Users table
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" ORDER BY id ASC;`
    );

    const userIds = users[0]; // Extract the array of user IDs

    await queryInterface.bulkInsert('Spots', [
      {
        ownerId: userIds[0].id, // First user ID
        address: '123 Ocean Drive',
        city: 'Los Angeles',
        state: 'California',
        country: 'USA',
        lat: 34.0522,
        lng: -118.2437,
        name: 'Luxury Villa in California',
        description: 'A beautiful luxury villa with stunning views of the ocean.',
        price: 500,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ownerId: userIds[1].id, // Second user ID
        address: '456 Manhattan Ave',
        city: 'New York',
        state: 'New York',
        country: 'USA',
        lat: 40.7128,
        lng: -74.0060,
        name: 'Modern Apartment in New York',
        description: 'A cozy and modern apartment located in the heart of New York City.',
        price: 400,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ownerId: userIds[2].id, // Third user ID
        address: '789 Mountain Road',
        city: 'Denver',
        state: 'Colorado',
        country: 'USA',
        lat: 39.7392,
        lng: -104.9903,
        name: 'Rustic Cabin in Colorado',
        description: 'A rustic cabin surrounded by mountains and nature in Colorado.',
        price: 300,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more spots if needed
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Spots', null, {});
  },
};
