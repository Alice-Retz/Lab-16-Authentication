const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const User = require('../models/User');
const UserService = require('../services/UserService');

module.exports = Router()
  .post('/signup', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);

      res.send(user);
    } catch (error) {
      error.status = 400;
      next(error);
    }
  })

  .post('/login', async (req, res, next) => {
    try {
      const user = await UserService.authorize(req.body);

      res.cookie('userId', user.id, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      });

      res.send(user);
    } catch (error) {
      error.status = 401;
      next(error);
    }
  })

  .get('/logout', async (req, res, next) => {
    res.clearCookie('userId');
    res.send('You have successfully logged out!');
  })

  .get('/me', ensureAuth, async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);

      res.send(user);
    } catch (error) {
      next(error);
    }
  });
