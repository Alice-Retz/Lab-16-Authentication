const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const Blog = require('../models/Blog');

module.exports = Router().post('/', ensureAuth, async (req, res, next) => {
  try {
    const blog = await Blog.insert({
      text: req.body.text,
      userId: req.user.id,
    });

    res.send(blog);
  } catch (error) {
    next(error);
  }
});
