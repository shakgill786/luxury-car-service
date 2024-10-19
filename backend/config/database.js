const config = require('../index');  // Adjust based on your config file location

module.exports = {
  development: {
    storage: config.dbFile,  // SQLite for local dev
    dialect: "sqlite",
    seederStorage: "sequelize",
    logQueryParameters: true,
    typeValidation: true,
  },
  production: {
    use_env_variable: 'DATABASE_URL',  // PostgreSQL on Render
    dialect: 'postgres',
    seederStorage: 'sequelize',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    define: {
      schema: process.env.SCHEMA,  // Ensure schema is set in Render env vars
    },
  },
};
