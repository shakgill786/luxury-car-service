const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../../../backend/db/models');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
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
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    // Return 500 to match the test case for existing users
    if (existingUser) {
      return res.status(500).json({
        message: 'User already exists',
        errors: {
          email: existingUser.email === email ? 'User with that email already exists' : undefined,
          username: existingUser.username === username ? 'User with that username already exists' : undefined,
        },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

    await setTokenCookie(res, safeUser);

    return res.status(201).json({ user: safeUser });

  } catch (error) {
    console.error('Sign-Up Error:', error);
    return res.status(500).json({
      message: 'Server Error',
      errors: error.errors || [],
    });
  }
});

// **Log In a User**
router.post('/', validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;

  // **1. Validate Request Body** (check if credential and password are provided)
  if (!credential || !password) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        credential: !credential ? "Email or username is required" : undefined,
        password: !password ? "Password is required" : undefined,
      },
    });
  }

  try {
    // **2. Find User by Username or Email**
    const user = await User.unscoped().findOne({
      where: {
        [Op.or]: [{ username: credential }, { email: credential }],
      },
    });

    // **3. Check if User Exists and Password Matches**
    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // **4. Create Safe User Object (exclude sensitive info)**
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    // **5. Set Token Cookie and Send Response**
    await setTokenCookie(res, safeUser);

    return res.status(200).json({ user: safeUser });

  } catch (error) {
    console.error("Login Error:", error);

    // **6. Handle Unexpected Errors with a Proper Message**
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});


// **Get Current User**
router.get('/me', restoreUser, async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(401).json({
        message: 'Authentication required',
        errors: { user: 'User is not authenticated' },
      });
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
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
