// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  };
  const token = jwt.sign(
    { data: safeUser },
    secret,
    { expiresIn: parseInt(expiresIn) }
  );

  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    maxAge: expiresIn * 1000, // Max age in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'Lax' : 'Strict',
  });

  return token;
};

// Middleware to restore user from JWT
const restoreUser = async (req, res, next) => {
  const { token } = req.cookies;
  req.user = null;

  if (!token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, secret);
    const user = await User.findByPk(payload.data.id, {
      attributes: ['id', 'email', 'username', 'firstName', 'lastName'],
    });

    if (user) {
      req.user = user;
    } else {
      res.clearCookie('token');
    }
    next();
  } catch (err) {
    res.clearCookie('token');
    next();
  }
};

// Middleware for requiring authentication
const requireAuth = (req, res, next) => {
  if (req.user) return next();

  const err = new Error('Authentication required');
  err.status = 401;
  next(err);
};

module.exports = { setTokenCookie, restoreUser, requireAuth };
