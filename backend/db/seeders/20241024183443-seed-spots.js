'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Spots', [
      {
        ownerId: 1,  // Matches the ID set in the Users seeder
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
        ownerId: 2,  // Matches the ID set in the Users seeder
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
        ownerId: 3,  // Matches the ID set in the Users seeder
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
      // Add additional spots similarly
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Spots', null, {});
  }
};
