// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../../db/models');
const { setTokenCookie } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('email').isEmail().withMessage('Invalid email'),
  check('username')
    .isLength({ min: 4 })
    .withMessage('Username must be at least 4 characters'),
  check('firstName').exists({ checkFalsy: true }).withMessage('First name is required'),
  check('lastName').exists({ checkFalsy: true }).withMessage('Last name is required'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more'),
  handleValidationErrors,
];

router.post('/', validateSignup, async (req, res, next) => {
  const { email, password, username, firstName, lastName } = req.body;

  try {
    const existingEmail = await User.findOne({ where: { email } });
    const existingUsername = await User.findOne({ where: { username } });

    if (existingEmail) {
      return res.status(500).json({
        message: 'User already exists',
        errors: { email: 'User with that email already exists' },
      });
    }

    if (existingUsername) {
      return res.status(500).json({
        message: 'User already exists',
        errors: { username: 'User with that username already exists' },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      username,
      firstName,
      lastName,
      hashedPassword,
    });

    const safeUser = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    };

    await setTokenCookie(res, newUser);
    return res.status(201).json({ user: safeUser });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
