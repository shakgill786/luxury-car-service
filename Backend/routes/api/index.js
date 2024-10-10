const router = require("express").Router();
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const { User } = require('../../db/models');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
const usersRouter = require('./users'); // Import the users routes
router.use('/users', usersRouter); // Use the users routes for /api/users



// Test setting token
router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: { username: 'Demo-lition' }
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});

// Test restoring user
router.use(restoreUser);

router.get('/restore-user', (req, res) => {
  return res.json(req.user);
});

// Test requiring authentication
router.get('/require-auth', requireAuth, (req, res) => {
  return res.json(req.user);
});

module.exports = router;

