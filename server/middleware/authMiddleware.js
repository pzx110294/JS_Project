const { verifyToken } = require('../helpers/tokenHelper');

function authMiddleware(roles = []) {
  return async (req, res, next) => {
    try {

      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {

        throw new Error('Unauthorized');
      }

      const decoded = verifyToken(token);
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        throw new Error('Unauthorized');
      }
      next();
    } catch (error) {
      error.status = 401;
      next(error);
    }
  };
}

module.exports = { auth: authMiddleware };