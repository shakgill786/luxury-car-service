module.exports = {
  development: {
    storage: './dev.db',
    dialect: 'sqlite',
    seederStorage: 'sequelize',
    logQueryParameters: true,
    typeValidation: true,
  },
  production: {
    use_env_variable: 'DATABASE_URL', // Correct usage of the environment variable
    dialect: 'postgres',
    seederStorage: 'sequelize',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Allows self-signed certificates (if applicable)
      },
    },
    define: {
      schema: 'luxury_schema', // The correct schema name you're using
    },
  },
};
