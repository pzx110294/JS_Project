const { User } = require("../models");
const { compare } = require("bcrypt");

async function authenticate(username, password) {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await compare(password, user.password))) {
        const error = new Error('Invalid credentials');
        error.status = 401;
        throw error;
    }
    return user;
}
module.exports = { authenticate }