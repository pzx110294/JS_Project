const { User } = require('../../models');
const { generateToken } = require('../../helpers/tokenHelper');
const { authenticate } = require('../../helpers/authenticateUser');
async function register(userData) {
  const user = await User.create({
      userData,
      role: 'user'
  });
  return generateToken(user);
}

async function login(username, password) {
  const user = await authenticate(username, password);
  return generateToken(user);
}

module.exports = { register, login };