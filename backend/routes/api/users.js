// backend/routes/api/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // For password hashing
const { User } = require('../../../backend/db/models'); // Import User model
const { Sequelize } = require('../../../backend/db/models');
const { setTokenCookie } = require('../../utils/auth'); // Helper to set cookie
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];



// Sign up route
router.post(
  '/',
  validateSignup,  // Add the validation middleware here
  async (req, res) => {
    const { email, password, username } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ email, username, hashedPassword });

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  }
);


router.post('/login', async (req, res, next) => {
    console.log('Login request body:', req.body);  // Log request body
  
    const { credential, password } = req.body;
  
    // Find user by email or username
    const user = await User.findOne({
      where: {
        [Sequelize.Op.or]: { email: credential, username: credential }
      }
    });
  
    if (!user) {
      console.log('User not found');
      const err = new Error('Login failed');
      err.status = 401;
      return next(err);
    }
  
    console.log('User found:', user.username);
  
    // Check password
    const isPasswordMatch = bcrypt.compareSync(password, user.hashedPassword.toString());
    if (!isPasswordMatch) {
      console.log('Password mismatch');
      const err = new Error('Login failed');
      err.status = 401;
      return next(err);
    }
  
    console.log('Password match, login successful');
  
    // Set token cookie after successful login
    setTokenCookie(res, user);
  
    // Return user data (without sensitive info)
    return res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  });



// Sign up
router.post(
    '/',
    async (req, res) => {
      const { email, password, username } = req.body;
      
      // Hash the password
      const hashedPassword = bcrypt.hashSync(password);
      
      // Create the new user in the database
      const user = await User.create({ email, username, hashedPassword });
  
      // Remove sensitive information before returning the user
      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
      };
  
      // Set the token cookie
      await setTokenCookie(res, safeUser);
  
      // Return the newly created user
      return res.json({
        user: safeUser
      });
    }
  );

module.exports = router;
