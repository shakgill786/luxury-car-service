const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../../backend/db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// POST /api/session - Log in a user
router.post('/api/session', async (req, res) => {
  const { credential, password } = req.body;

  // Validate request body
  if (!credential || !password) {
    return res.status(400).json({
      message: 'Bad Request',
      errors: {
        credential: 'Email or username is required',
        password: 'Password is required',
      },
    });
  }

  try {
    // Find user by email or username
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: credential }, { username: credential }],
      },
    });

    // If user not found or password invalid, return 401 error
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token for session management
    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });

    // Send the token as a cookie and return user info
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

    return res.status(200).json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
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
