'use strict';

const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; 
}
options.tableName = 'ReviewImages'; 

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const reviews = await queryInterface.sequelize.query(
      `SELECT id FROM "${options.schema ? `${options.schema}.` : ''}Reviews" ORDER BY id ASC;`
    );

    const reviewIds = reviews[0]; 

    if (reviewIds.length < 3) {
      throw new Error('Not enough reviews found to seed ReviewImages.');
    }

    await queryInterface.bulkInsert(options, [
      {
        reviewId: reviewIds[0].id,
        url: 'https://example.com/review1.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        reviewId: reviewIds[1].id,
        url: 'https://example.com/review2.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        reviewId: reviewIds[2].id,
        url: 'https://example.com/review3.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(options, null, {});
  },
};
