'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Define schema for production
}
options.tableName = 'Spots'; // Ensure the correct table name is set in options

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "${options.schema ? `${options.schema}.` : ''}Users" ORDER BY id ASC;`
    );

    const userIds = users[0];

    if (userIds.length < 3) {
      throw new Error('Not enough users found to seed spots.');
    }

    await queryInterface.bulkInsert(
      options,
      [
        {
          ownerId: userIds[0].id,
          address: '123 Ocean Drive',
          city: 'Los Angeles',
          state: 'California',
          country: 'USA',
          lat: 34.0522,
          lng: -118.2437,
          name: 'Luxury Villa', // Ensure name is < 50 chars
          description: 'A beautiful luxury villa with stunning views of the ocean.',
          price: 500,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: userIds[1].id,
          address: '456 Manhattan Ave',
          city: 'New York',
          state: 'New York',
          country: 'USA',
          lat: 40.7128,
          lng: -74.0060,
          name: 'Modern Apartment', // Ensure name is < 50 chars
          description: 'A cozy and modern apartment located in the heart of New York City.',
          price: 400,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: userIds[2].id,
          address: '789 Mountain Road',
          city: 'Denver',
          state: 'Colorado',
          country: 'USA',
          lat: 39.7392,
          lng: -104.9903,
          name: 'Rustic Cabin', // Ensure name is < 50 chars
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
    await queryInterface.bulkDelete(
      options,
      {
        address: { [Sequelize.Op.in]: ['123 Ocean Drive', '456 Manhattan Ave', '789 Mountain Road'] },
      },
      {}
    );
  },
};
