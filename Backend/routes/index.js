// backend/routes/index.js
const express = require('express');
const router = express.Router();

const apiRouter = require('./api');

router.use('/api', apiRouter);
// ...


// Test route to verify everything is set up properly
router.get('/hello/world', (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken()); // Setting CSRF token in the cookies
  res.send('Hello World!'); // Send the response
});

// Route to restore CSRF token for development
router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});

module.exports = router;
