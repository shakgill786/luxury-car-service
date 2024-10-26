const express = require('express');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User } = require('../../../backend/db/models');
const csrf = require('csurf');

// **Importing Routers for Various Resources**
const sessionRouter = require('./session');
const usersRouter = require('./users');
const spotsRouter = require('./spots');
const reviewsRouter = require('./reviews');
const bookingsRouter = require('./bookings');
const imagesRouter = require('./images');

// **Create Express Router Instance**
const router = express.Router();

// **Restore User Middleware** - Ensures `req.user` is populated for authenticated routes
router.use(restoreUser);

// **Register API Routes**
router.use('/images', imagesRouter);
router.use('/bookings', bookingsRouter);
router.use('/reviews', reviewsRouter);
router.use('/spots', spotsRouter);
router.use('/session', sessionRouter); // Handles login/logout routes
router.use('/users', usersRouter); // Handles user registration routes

// **Test Route: Set Token Cookie**
router.get('/set-token-cookie', async (_req, res) => {
  try {
    const user = await User.findOne({ where: { username: 'Demo-lition' } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    setTokenCookie(res, user);
    return res.json({ user });
  } catch (error) {
    console.error('Set Token Cookie Error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// **Test Route: Restore User**
router.get('/restore-user', (req, res) => {
  return res.json(req.user || { user: null });
});

// **Test Route: Require Authentication**
router.get('/require-auth', requireAuth, (req, res) => {
  return res.json(req.user);
});

module.exports = router;
