const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const ensureAdmin = require('../middleware/ensure-admin');
const UserService = require('../services/UserService');
const User = require('../models/User');

const ONE_DAY = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/signup', async (req, res, next) => {
    try {
      const user = await UserService.create({ ...req.body, roleTitle: 'USER' });

      res.cookie('session', user.authToken(), {
        httpOnly: true,
        maxAge: ONE_DAY,
      });

      res.send(user);
    } catch (error) {
      error.status = 400;
      next(error);
    }
  })

  //=====================================================//

  .post('/login', async (req, res, next) => {
    try {
      const user = await UserService.authorize(req.body);

      res.cookie('userId', user.authToken(), {
        httpOnly: true,
        maxAge: ONE_DAY,
      });

      res.send(user);
    } catch (error) {
      error.status = 401;
      next(error);
    }
  })

  //=====================================================//

  .get('/me', ensureAuth, async (req, res, next) => {
    try {
      // const user = await User.findById(req.userId);

      res.send(req.user);
    } catch (error) {
      next(error);
    }
  })

  //=====================================================//

  .patch('/:id', ensureAuth, ensureAdmin, async (req, res, next) => {
    try {
      console.log('!!', req.body);
      const roleUpdate = await User.updateRole(req.params.id, req.body);
      res.send(roleUpdate);
    } catch (error) {
      next(error);
    }
  })

  //=====================================================//

  .get('/logout', async (req, res, next) => {
    res.clearCookie('userId');
    res.send('You have successfully logged out!');
  });
