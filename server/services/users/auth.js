const { User } = require('../../models');
const { generateToken } = require('../../helpers/tokenHelper');
const { authenticate } = require('../../helpers/authenticateUser');
async function register(userData) {
  const user = await User.create({
      username: userData.username,
      password: userData.password,
      role: 'user'
  });
  return generateToken(user);
}

async function login(username, password) {
  const user = await authenticate(username, password);
  return generateToken(user);
}

async function getUserInfo(id) {
    const user = await User.findByPk(id, {
        attributes: ['username', 'role']
    });
    if (!user) {
        throw  new Error(`User not found`);
    }
    return user;
}
module.exports = { register, login, getUserInfo };