// backend/routes/index.js
const express = require('express');
const router = express.Router();
const apiRouter = require('./api');

// Use the API router for all /api routes
router.use('/api', apiRouter);

// Test route to verify everything is set up properly (development only)
if (process.env.NODE_ENV !== 'production') {
  router.get('/hello/world', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken()); // Setting CSRF token in the cookies
    res.send('Hello World!'); // Send the response
  });
}

// Route to restore CSRF token (development only)
if (process.env.NODE_ENV !== 'production') {
  router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
      'XSRF-Token': csrfToken
    });
  });
}

module.exports = router;
