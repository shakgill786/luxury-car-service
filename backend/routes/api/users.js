const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../../../backend/db/models');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');
const router = express.Router();


// **Sign Up a User**
router.post('/', async (req, res) => {
  const { email, password, username, firstName, lastName } = req.body;

  // **1. Inline Request Body Validation**
  const errors = {};
  if (!email || !email.includes('@')) errors.email = 'Invalid email';
  if (!username || username.length < 4) errors.username = 'Username is required and must be at least 4 characters';
  if (!password || password.length < 6) errors.password = 'Password must be 6 characters or more';
  if (!firstName) errors.firstName = 'First Name is required';
  if (!lastName) errors.lastName = 'Last Name is required';

  // **2. Check if there are any validation errors**
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Bad Request',
      errors,
    });
  }

  try {
    // **3. Check for Existing User**
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(500).json({
        message: 'User already exists',
        errors: {
          email: existingUser.email === email ? 'User with that email already exists' : undefined,
          username: existingUser.username === username ? 'User with that username already exists' : undefined,
        },
      });
    }

    // **4. Create New User**
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

    // **5. Set Token Cookie and Respond with User Info**
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
