import jwt from 'jsonwebtoken';

/**
 * Authentication middleware to verify JWT bearer token.
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token provided.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'carbon_coach_secret_dev');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authorization token.',
    });
  }
};

/**
 * Optional authentication middleware:
 * Attaches decoded user if valid Bearer token provided, but does not block unauthenticated access.
 */
export const optionalAuthenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'carbon_coach_secret_dev');
      req.user = decoded;
    } catch (error) {
      // Token invalid or expired, continue as guest
      req.user = null;
    }
  }

  next();
};
