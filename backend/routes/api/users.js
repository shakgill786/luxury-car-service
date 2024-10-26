const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../../db/models');
const { setTokenCookie } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// **Validation Middleware for User Sign-Up**
const validateSignup = [
  check('email')
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .isLength({ min: 4 })
    .withMessage('Username must be at least 4 characters long'),
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('First name is required'),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Last name is required'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more'),
  handleValidationErrors,
];

// **Create a New User (Sign-Up)**
router.post('/', validateSignup, async (req, res, next) => {
  const { email, password, username, firstName, lastName } = req.body;

  // **Check for existing user by email or username**
  const existingUser = await User.findOne({
    where: { email },
  });

  if (existingUser) {
    return res.status(500).json({
      message: 'User already exists',
      errors: {
        email: 'User with that email already exists',
      },
    });
  }

  const existingUsername = await User.findOne({
    where: { username },
  });

  if (existingUsername) {
    return res.status(500).json({
      message: 'User already exists',
      errors: {
        username: 'User with that username already exists',
      },
    });
  }

  // **Hash password and create new user**
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    email,
    username,
    firstName,
    lastName,
    hashedPassword,
  });

  // **Create a safe user object for response**
  const safeUser = {
    id: newUser.id,
    email: newUser.email,
    username: newUser.username,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
  };

  // **Set JWT cookie for the new user**
  await setTokenCookie(res, newUser);

  // **Send response with 201 status**
  return res.status(201).json({ user: safeUser });
});

module.exports = router;
