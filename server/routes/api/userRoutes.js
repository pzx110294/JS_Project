const express = require('express');
const router = express.Router();
const { register, login, getUserInfo} = require('../../services/users/auth');
const { validateFields } = require('../../helpers/validateFields');
const {auth} = require("../../middleware/authMiddleware");

router.post('/register', async (req, res, next) => {
  try {
    validateFields(req.body, ['username', 'password'], 'User');
    const token = await register(req.body);
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    validateFields(req.body, ['username', 'password'], 'User');
    const token = await login(req.body.username, req.body.password);
    res.json({ token });
  } catch (error) {
    next(error);
  }
});
router.get('/me', auth(), async (req, res, next) => {
  try {
    const user = await getUserInfo(req.user.id);
    res.json(user);
} catch (error) {
    next(error);
  }
});
module.exports = router;