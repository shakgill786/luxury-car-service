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

const csrfProtection = csrf({ cookie: true });

router.get('/csrf/restore', csrfProtection, (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie('XSRF-TOKEN', csrfToken);
  res.status(200).json({ 'XSRF-Token': csrfToken });
});

router.use(restoreUser);
router.use('/images', imagesRouter);
router.use('/bookings', bookingsRouter);
router.use('/reviews', reviewsRouter);
router.use('/spots', spotsRouter);
router.use('/session', sessionRouter);
router.use('/users', usersRouter);

module.exports = router;
