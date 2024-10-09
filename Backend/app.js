// backend/app.js

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
const routes = require('./routes');
app.use(routes);

// Export the app
module.exports = app;
