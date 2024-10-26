const router = require('express').Router();
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User } = require('../../../backend/db/models');
const csrf = require('csurf');

const sessionRouter = require('./session');
const usersRouter = require('./users');
const spotsRouter = require('./spots');
const reviewsRouter = require('./reviews');
const bookingsRouter = require('./bookings');
const imagesRouter = require('./images');

// **CSRF Protection Middleware**
const csrfProtection = csrf({ cookie: true });

router.get('/csrf/restore', csrfProtection, (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie('XSRF-TOKEN', csrfToken);
  res.status(200).json({ 'XSRF-Token': csrfToken });
});


// **Restore User Middleware** - Ensures `req.user` is populated for routes that need it.
router.use(restoreUser);

// **Register API Routes**
router.use('/images', imagesRouter);
router.use('/bookings', bookingsRouter);
router.use('/reviews', reviewsRouter);
router.use('/spots', spotsRouter);
router.use('/session', sessionRouter); // Handles login and logout routes
router.use('/users', usersRouter); // Handles user registration routes

// **Test Route: Set Token Cookie**
router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({ where: { username: 'Demo-lition' } });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  setTokenCookie(res, user);
  return res.json({ user });
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