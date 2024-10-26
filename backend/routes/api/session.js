const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Validation middleware for login requests
const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Email or username is required'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required'),
  handleValidationErrors,
];

// Log In a User
router.post('/', validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;

  const user = await User.unscoped().findOne({
    where: {
      [Op.or]: [{ username: credential }, { email: credential }],
    },
  });

  // If user not found or password doesn't match
  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    return res.status(401).json({
      message: 'Invalid credentials',
    });
  }

  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
  };

  // Set token cookie
  await setTokenCookie(res, user);

  // Successful response
  return res.status(200).json({ user: safeUser });
});

// Get the Current User
router.get('/', restoreUser, (req, res) => {
  const { user } = req;

  if (user) {
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };

    // Return user data if authenticated
    return res.status(200).json({ user: safeUser });
  } else {
    // If no user is logged in, return null
    return res.status(200).json({ user: null });
  }
});

// Logout the Current User (Optional Feature)
router.delete('/', (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Successfully logged out' });
});

module.exports = router;
