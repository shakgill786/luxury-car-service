const router = require("express").Router();
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const { User } = require('../../../backend/db/models/index.js');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js'); // Import the users routes
const spotsRouter = require('./spots');
const reviewsRouter = require('./reviews');
const bookingsRouter = require('./bookings');
const imagesRouter = require('./images');   // Import the images router


router.use(restoreUser); 
router.use('/images', imagesRouter);
router.use('/bookings', bookingsRouter);
router.use('/reviews', reviewsRouter);
router.use('/spots', spotsRouter);
router.use('/session', sessionRouter); // handles login and logout
router.use('/users', usersRouter); // Use the users routes for /api/users



// Test setting token
router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: { username: 'Demo-lition' }
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});


router.get('/restore-user', (req, res) => {
  return res.json(req.user);
});

// Test requiring authentication
router.get('/require-auth', requireAuth, (req, res) => {
  return res.json(req.user);
});

module.exports = router;

