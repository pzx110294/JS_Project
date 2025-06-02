const { verifyToken } = require('../helpers/tokenHelper');

function authMiddleware(roles = [], optional = false) {
  return async (req, res, next) => {
    try {
      console.log(req.headers)
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        const decoded = verifyToken(token);
        req.user = decoded;
        if (roles.length && !roles.includes(decoded.role)) {
          throw new Error('Unauthorized');
        }
      } else if (!optional) {
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