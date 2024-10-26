'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Define schema for production
}
options.tableName = 'Spots'; // Ensure the correct table name is set in options

module.exports = {
  async up(queryInterface, Sequelize) {
    // Retrieve user IDs dynamically from the Users table
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "${options.schema ? `${options.schema}.` : ''}Users" ORDER BY id ASC;`
    );

    const userIds = users[0]; // Extract the array of user IDs

    await queryInterface.bulkInsert(
      options, // Use options here
      [
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
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options, null, {}); // Use options here as well
  },
};
