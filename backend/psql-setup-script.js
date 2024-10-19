const { sequelize } = require('./db/models');
const config = require('../config/database');  // Adjust path if needed


sequelize.showAllSchemas({ logging: false }).then(async (data) => {
  if (!data.includes(process.env.SCHEMA)) {
    await sequelize.createSchema(process.env.SCHEMA);
  }
});
