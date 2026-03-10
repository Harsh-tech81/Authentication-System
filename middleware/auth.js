const User = require('../models/User');
const { verifyToken } = require('../utils/jwtUtils');

/**
 * Protect routes - JWT authentication middleware
 * Checks for token in cookie or Authorization header
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in HTTP-only cookie (preferred method)
    if (req.cookies.token) {
      token = req.cookies.token;
    }
    // Check for token in Authorization header (Bearer token)
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Please login.'
      });
    }

    try {
      // Verify token
      const decoded = verifyToken(token);

      // Get user from token
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'User account is deactivated'
        });
      }

      // Attach user to request object
      req.user = user;
      next();

    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

  } catch (error) {
    console.error('Auth Middleware Error:', error);
    next(error);
  }
};

/**
 * Authorize specific roles
 * @param  {...any} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
