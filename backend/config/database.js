const config = require('./index'); // Ensure './index' exports the necessary environment variables

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: './db/dev.sqlite',  // SQLite for development
    seederStorage: 'sequelize', // Stores seed data in SequelizeMeta
    logQueryParameters: true,   // Log query parameters for debugging
    typeValidation: true,       // Enable strict type validation
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',  // Use in-memory DB for testing
    seederStorage: 'sequelize',
    logging: false,       // Disable logs during tests
  },
  production: {
    use_env_variable: 'DATABASE_URL', // Use DATABASE_URL from env vars
    dialect: 'postgres',
    seederStorage: 'sequelize',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Allow SSL for Heroku-like environments
      },
    },
    define: {
      schema: process.env.SCHEMA || 'public', // Default to 'public' schema
    },
  },
};
