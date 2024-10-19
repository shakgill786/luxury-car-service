const express = require('express');
require('express-async-errors'); // For handling async route errors
const morgan = require('morgan'); // For logging HTTP requests
const cors = require('cors'); // Cross-Origin Resource Sharing
const csurf = require('csurf'); // CSRF protection
const helmet = require('helmet'); // Security middleware
const cookieParser = require('cookie-parser'); // To parse cookies

// Import the config file
const { environment } = require('./config');
const isProduction = environment === 'production';

// Initialize the express app
const app = express();

// Connect the morgan middleware for logging
app.use(morgan('dev'));

// Middleware for parsing cookies and JSON request bodies
app.use(cookieParser());
app.use(express.json());

// Security Middleware
if (!isProduction) {
  // Enable CORS only in development
  app.use(cors());
}

// Use helmet for better security
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
  })
);

// Set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true
    }
  })
);

// Import routes and apply them to the app
const routes = require('../backend/routes');  // Import the routes file
app.use(routes);  // Use the imported routes

// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

// Import Sequelize ValidationError
const { ValidationError } = require('sequelize');

// Process Sequelize errors
app.use((err, _req, _res, next) => {
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = 'Validation Error';
    err.errors = errors;
  }
  next(err);
});

// Error formatter
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  });
});

// Export the app
module.exports = app;
