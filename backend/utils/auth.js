// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// **Set JWT Token in a Cookie**
const setTokenCookie = (res, user) => {
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,  // Added firstName
    lastName: user.lastName,    // Added lastName
  };

  // Generate a JWT token
  const token = jwt.sign({ data: safeUser }, secret, { expiresIn: parseInt(expiresIn) });

  const isProduction = process.env.NODE_ENV === 'production';

  // Set the token as an HTTP-only cookie
  res.cookie('token', token, {
    maxAge: expiresIn * 1000, // Convert expiresIn to milliseconds
    httpOnly: true,            // Prevent client-side access to the token
    secure: isProduction,       // Use secure cookies in production
    sameSite: isProduction ? 'Lax' : 'Strict', // Mitigate CSRF attacks
  });

  return token;
};

// **Middleware to Restore User Session**
const restoreUser = async (req, res, next) => {
  const { token } = req.cookies;
  req.user = null; // Initialize user as null

  if (!token) return next(); // If no token, skip to the next middleware

  try {
    // Verify the token
    const jwtPayload = jwt.verify(token, secret);
    const { id } = jwtPayload.data;

    // Fetch the user by ID with only necessary attributes
    const user = await User.findByPk(id, {
      attributes: ['id', 'email', 'username', 'firstName', 'lastName', 'createdAt', 'updatedAt'],
    });

    if (user) {
      req.user = user; // Attach user to request if found
    } else {
      res.clearCookie('token'); // Clear token if user is not found
    }

    return next();
  } catch (err) {
    // Clear token if it’s invalid or expired
    res.clearCookie('token');
    return next();
  }
};

// **Middleware for Requiring Authentication**
const requireAuth = (req, _res, next) => {
  if (req.user) return next(); // If user is authenticated, proceed

  const err = new Error('Authentication required');
  err.title = 'Authentication required';
  err.errors = { message: 'Authentication required' };
  err.status = 401;
  return next(err); // Pass the error to the next middleware
};

module.exports = { setTokenCookie, restoreUser, requireAuth };
