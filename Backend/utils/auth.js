// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
    // Create the token.
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    const token = jwt.sign(
      { data: safeUser },
      secret,
      { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );
  
    const isProduction = process.env.NODE_ENV === 'production';
  
    // Set the token cookie
    res.cookie('token', token, {
      maxAge: expiresIn * 1000, // maxAge in milliseconds
      httpOnly: true, // Make the cookie HTTP-only to prevent client-side access
      secure: isProduction, // Use HTTPS only in production
      sameSite: isProduction ? 'Lax' : 'Strict', // Cross-site request security
    });
  
    return token;
  };

  // Restore the session user based on the JWT cookie
const restoreUser = (req, res, next) => {
    const { token } = req.cookies;
    req.user = null;
  
    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
      if (err) {
        return next(); // If the token is invalid, proceed without a user
      }
  
      try {
        const { id } = jwtPayload.data;
        req.user = await User.findByPk(id, {
          attributes: { include: ['email', 'createdAt', 'updatedAt'] }, // Don't include sensitive fields like hashedPassword
        });
      } catch (e) {
        res.clearCookie('token'); // Clear invalid token
        return next();
      }
  
      if (!req.user) res.clearCookie('token'); // Clear token if user is not found
  
      return next();
    });
  };
  
  // If there is no current user, return an error
const requireAuth = (req, _res, next) => {
    if (req.user) return next(); // If there is a user, allow access
  
    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err);
  };
  
  module.exports = { setTokenCookie, restoreUser, requireAuth };
