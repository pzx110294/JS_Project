const express = require('express');
const router = express.Router();
const { register, login } = require('../../services/users/auth');
const { validateFields } = require('../../helpers/validateFields');

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

module.exports = router;