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
  };
  const token = jwt.sign(
    { data: safeUser },
    secret,
    { expiresIn: parseInt(expiresIn) }
  );

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie('token', token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax"
  });

  return token;
};
const restoreUser = (req, res, next) => {
  const { token } = req.cookies;
  req.user = null;

  if (!token) {
    return next(); // If no token, move to the next middleware
  }

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      console.error('JWT verification failed:', err);
      return next(); // If token is invalid or expired, skip to the next middleware
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.findByPk(id, {
        attributes: ['id', 'email', 'username', 'createdAt', 'updatedAt'], // Fetch only necessary fields
      });

      if (!req.user) {
        res.clearCookie('token'); // Clear the token if user isn't found
      }
    } catch (e) {
      console.error('Error while fetching user:', e);
      res.clearCookie('token');
      return next(); // Clear the token and move on in case of error
    }

    return next(); // Proceed to the next middleware if everything is OK
  });
};


// Middleware for requiring user authentication
const requireAuth = (req, _res, next) => {
  if (req.user) return next();

  const err = new Error('Authentication required');
  err.title = 'Authentication required';
  err.errors = { message: 'Authentication required' };
  err.status = 401;
  return next(err);
};

module.exports = { setTokenCookie, restoreUser, requireAuth };
