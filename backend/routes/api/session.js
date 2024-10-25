const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../../backend/db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Login Validation Middleware
const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors,
];

// Log In a User
router.post('/', validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;

  const user = await User.unscoped().findOne({
    where: {
      [Op.or]: [{ username: credential }, { email: credential }],
    }
  });

  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
const session_id = await setTokenCookie(res, safeUser);

  // Adjust the response to include session_id and user_id explicitly
  return res.json({ 
    user: safeUser,
    session_id: session_id, // Add session ID
    user_id: user.id.toString() // Ensure user_id is a string
  });
});

// Restore Session User (Get Current User)
router.get('/', restoreUser, (req, res) => {
  const { user } = req;

  if (user) {
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    return res.status(200).json({ 
      user: safeUser,
      session_id: req.cookies.token, // Assuming the session ID is the JWT token
      user_id: user.id.toString() // Ensure user_id is a string
    });
  } else {
    return res.status(401).json({ message: "Authentication required" });
  }
});

module.exports = router;