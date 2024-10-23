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

  // Check if email or username already exists
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ email }, { username }],
    },
  });

  if (existingUser) {
    const err = new Error('User already exists');
    err.status = 500;
    err.title = 'User already exists';
    err.errors = {
      email: 'User with that email or username already exists',
    };
    return next(err);
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password);
  
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
});

module.exports = router;
