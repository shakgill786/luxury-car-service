// backend/routes/api/session.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();

// Log in
router.post('/', async (req, res, next) => {
  const { credential, password } = req.body;

  // Find the user by either username or email
  const user = await User.unscoped().findOne({
    where: {
      [Op.or]: {
        username: credential,
        email: credential,
      },
    },
  });

  // If user not found or password doesn't match, throw an error
  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    const err = new Error('Login failed');
    err.status = 401;
    err.errors = { credential: 'The provided credentials were invalid.' };
    return next(err);
  }

  // If successful, return user information and set the token
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };

  await setTokenCookie(res, safeUser);
  return res.json({ user: safeUser });
});


// Log out
router.delete(
    '/',
    (_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    }
  );


// Restore session user
router.get(
    '/',
    (req, res) => {
      const { user } = req; // req.user is set by restoreUser middleware
      if (user) {
        const safeUser = {
          id: user.id,
          email: user.email,
          username: user.username,
        };
        return res.json({
          user: safeUser
        });
      } else {
        return res.json({ user: null });
      }
    }
  );

module.exports = router;
