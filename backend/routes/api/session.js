const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../../backend/db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// **Login Validation Middleware**
const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
];

// **Log In a User**
router.post(
  '/',
    validateLogin,
    async (req, res, next) => {
      const { credential, password } = req.body;

      const user = await User.unscoped().findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });

      if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = new Error('Invalid credentials');
        err.status = 401;
        err.title = 'Invalid credentials';
        err.errors = { credential: 'Invalid credentials' };
        return next(err);
      }

      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    }
);

  // **Invalid Credentials Error Handling**
  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    return res.status(401).json({
      message: 'Invalid credentials',
      errors: { credential: 'The provided credentials were invalid.' }
    });
  }

  // **Prepare Safe User Object for Response**
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName
  };

  // **Set Token Cookie**
  await setTokenCookie(res, safeUser);

  return res.json({ user: safeUser });
});

// **Log Out a User**
router.delete('/', (_req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'Successfully logged out' });
});

// **Restore Session User**
router.get('/', restoreUser, (req, res) => {
  const { user } = req;
  
  if (user) {
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName
    };
    return res.json({ user: safeUser });
  } else {
    return res.json({ user: null });
  }
});

module.exports = router;
