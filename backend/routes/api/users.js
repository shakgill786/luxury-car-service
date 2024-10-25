const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../../../backend/db/models');
const { setTokenCookie } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');
const router = express.Router();

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

// **Signup Route**
router.post('/', validateSignup, async (req, res, next) => {
  const { email, password, username, firstName, lastName } = req.body;

  try {
    // Check for existing user by email or username
    const existingUserByEmail = await User.findOne({
      where: { email },
    });

    const existingUserByUsername = await User.findOne({
      where: { username },
    });

    if (existingUserByEmail || existingUserByUsername) {
      return res.status(409).json({
        message: 'User already exists',
        errors: {
          email: existingUserByEmail ? 'A user with that email already exists' : undefined,
          username: existingUserByUsername ? 'A user with that username already exists' : undefined,
        },
      });
    }

    // Hash the password with salt
    const hashedPassword = await bcrypt.hash(password, 10);

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

    // Return the new user
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
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.hashedPassword)) {
      return res.status(401).json({
        message: 'Invalid credentials',
        errors: { email: 'Invalid email or password' },
      });
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    // Set the token cookie
    await setTokenCookie(res, safeUser);

    return res.status(200).json({ user: safeUser });

  } catch (error) {
    console.error('Log-In Error:', error);
    return res.status(500).json({
      message: 'Server Error',
      errors: error.errors || [],
    });
  }
});

// **Get Current User Route**
router.get('/me', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Authentication required',
        errors: { user: 'User is not authenticated' },
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return res.status(200).json(safeUser);
  } catch (error) {
    console.error('Get Current User Error:', error);
    return res.status(500).json({
      message: 'Server Error',
      errors: error.errors || [],
    });
  }
});

module.exports = router;
