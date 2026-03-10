const express = require('express');
const router = express.Router();

// Import controllers
const {
  signup,
  login,
  logout,
  getMe,
  updatePassword
} = require('../controllers/authController');

// Import middleware
const { protect } = require('../middleware/auth');
const { authRateLimiter, strictRateLimiter } = require('../middleware/rateLimiter');
const {
  signupValidation,
  loginValidation,
  updatePasswordValidation
} = require('../middleware/validator');

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 * Rate Limit: 5 requests per 15 minutes
 */
router.post('/signup', authRateLimiter, signupValidation, signup);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 * Rate Limit: 5 requests per 15 minutes
 */
router.post('/login', authRateLimiter, loginValidation, login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (clear cookie)
 * @access  Private
 */
router.post('/logout', protect, logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
router.get('/me', protect, getMe);

/**
 * @route   PUT /api/auth/update-password
 * @desc    Update user password
 * @access  Private
 * Rate Limit: 3 requests per hour (strict)
 */
router.put('/update-password', protect, strictRateLimiter, updatePasswordValidation, updatePassword);

module.exports = router;
