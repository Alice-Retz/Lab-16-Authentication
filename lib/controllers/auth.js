const { Router } = require('express');
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
      });

      res.send(user);
    } catch (error) {
      next(error);
    }
  })

  .get('/logout', async (req, res, next) => {
    res.clearCookie('userId');
    res.send('You have successfully logged out!');
  });
