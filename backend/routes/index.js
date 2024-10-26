const express = require('express');
const router = express.Router();
const apiRouter = require('./api');

// **Use the API Router for All /api Routes**
router.use('/api', apiRouter);

// **Development-Only Test Route**
if (process.env.NODE_ENV !== 'production') {
  router.get('/hello/world', (req, res) => {
    try {
      const csrfToken = req.csrfToken(); // Set CSRF token in cookies
      res.cookie('XSRF-TOKEN', csrfToken, {
        httpOnly: true,
        secure: false, // Adjust as needed for development
        sameSite: 'Strict', // Strict in development to avoid cross-origin issues
      });
      res.status(200).json({ message: 'Hello World!', csrfToken });
    } catch (error) {
      console.error('Error in /hello/world:', error);
      res.status(500).json({ message: 'Failed to generate CSRF token' });
    }
  });
}

// **Root Route for the API**
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Luxury Car Service API!',
    status: 'Running',
  });
});

// **Route to Restore CSRF Token**
router.get('/api/csrf/restore', (req, res) => {
  try {
    console.log('CSRF restore route hit'); // Debugging log
    const csrfToken = req.csrfToken(); // Generate CSRF token
    res.cookie('XSRF-TOKEN', csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'Lax' : 'Strict',
    });
    res.status(200).json({ 'XSRF-Token': csrfToken });
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    res.status(500).json({ message: 'Failed to generate CSRF token' });
  }
});

module.exports = router;
