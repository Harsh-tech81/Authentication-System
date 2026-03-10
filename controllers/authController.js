const User = require('../models/User');
const { sendTokenResponse, clearTokenCookie } = require('../utils/jwtUtils');

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    
    const user = await User.create({
      name,
      email,
      password
    });

    
    sendTokenResponse(user, 201, res, 'User registered successfully');

  } catch (error) {
    console.error('Signup Error:', error);
    
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return token
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    
    if (user.isLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.'
      });
    }

    
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      
      await user.incLoginAttempts();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    
    await user.resetLoginAttempts();

    
    sendTokenResponse(user, 200, res, 'Login successful');

  } catch (error) {
    console.error('Login Error:', error);
    next(error);
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and clear cookie
 * @access  Private
 */
const logout = async (req, res, next) => {
  try {
    
    clearTokenCookie(res);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout Error:', error);
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('Get Me Error:', error);
    next(error);
  }
};

/**
 * @route   PUT /api/auth/update-password
 * @desc    Update user password
 * @access  Private
 */
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    
    const user = await User.findById(req.user.id).select('+password');

    
    const isPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    
    user.password = newPassword;
    await user.save();

    
    sendTokenResponse(user, 200, res, 'Password updated successfully');

  } catch (error) {
    console.error('Update Password Error:', error);
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  getMe,
  updatePassword
};
