// backend/routes/api/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User } = require('../../../backend/db/models');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

// **Validation for Signup**
const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('First name is required.'),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Last name is required.'),
  handleValidationErrors,
];

// **Sign Up Route**
router.post('/', validateSignup, async (req, res, next) => {
  const { email, password, username, firstName, lastName } = req.body;

  try {
    // Check if email or username already exists
    const existingEmail = await User.findOne({ where: { email } });
    const existingUsername = await User.findOne({ where: { username } });

    if (existingEmail || existingUsername) {
      return res.status(500).json({
        message: 'User already exists',
        errors: {
          ...(existingEmail && { email: 'User with that email already exists' }),
          ...(existingUsername && { username: 'User with that username already exists' }),
        },
      });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create the user
    const user = await User.create({
      email,
      username,
      hashedPassword,
      firstName,
      lastName,
    });

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    // Set the token cookie
    await setTokenCookie(res, safeUser);

    // Return the new user with status 201
    return res.status(201).json({ user: safeUser });

  } catch (error) {
    console.error('Sign-Up Error:', error);
    return res.status(500).json({
      message: 'Server Error',
      errors: error.errors || [],
    });
  }
});

// **Login Route**
router.post('/login', async (req, res, next) => {
  const { credential, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: credential }, { username: credential }],
      },
    });

    if (!user || !bcrypt.compareSync(password, user.hashedPassword)) {
      return res.status(401).json({
        message: 'Invalid credentials',
        errors: { credential: 'Invalid email or username' },
      });
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    await setTokenCookie(res, safeUser);

    return res.status(200).json({ user: safeUser });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      message: 'Server Error',
      errors: error.errors || [],
    });
  }
});

// **Get Current User Route**
router.get('/session', restoreUser, async (req, res, next) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(200).json({ user: null });
    }

    const foundUser = await User.findByPk(user.id);

    if (!foundUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const safeUser = {
      id: foundUser.id,
      email: foundUser.email,
      username: foundUser.username,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
    };

    return res.status(200).json({ user: safeUser });
  } catch (error) {
    console.error('Get Current User Error:', error);
    return res.status(500).json({
      message: 'Server Error',
      errors: error.errors || [],
    });
  }
});

module.exports = router;
