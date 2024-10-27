const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../../backend/db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// **Login Validation Middleware**
const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
];


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



// **Log Out a User**
router.delete('/', (_req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'Successfully logged out' });
});

// **Restore Session User**
router.get('/', restoreUser, (req, res) => {
  const { user } = req;

  if (user) {
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName
    };
    return res.json({ user: safeUser });
  } else {
    return res.json({ user: null });
  }
});

module.exports = router;
