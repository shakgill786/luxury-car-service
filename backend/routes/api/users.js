// backend/routes/api/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User } = require('../../../backend/db/models');
const { setTokenCookie } = require('../../utils/auth');
const { check } = require('express-validator');
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
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
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
    // Check if email or username already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
        errors: {
          email: 'A user with that email or username already exists',
        },
      });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10); // Added salt rounds for more secure hashing

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

    // Return the new user with all required fields
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
    // Find the user by email
    const user = await User.findOne({ where: { email } });

    // If user doesn't exist or password doesn't match
    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
      return res.status(401).json({
        message: "Invalid credentials",
        errors: { email: "Invalid email or password" },
      });
    }

    // Create a safeUser object to use with the token
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
      message: "Server Error",
      errors: error.errors || [],
    });
  }
});

// **Get Current User Route**
router.get('/me', async (req, res, next) => {
  try {
    // Assuming req.user is set by an authentication middleware
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
        errors: { user: "User is not authenticated" },
      });
    }

    // Find the user by primary key
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
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
      message: "Server Error",
      errors: error.errors || [],
    });
  }
});



module.exports = router;
