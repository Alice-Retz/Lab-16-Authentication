const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = class UserService {
  static async create({ email, password }) {
    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      throw new Error('User already exists for the given email');
    }

    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const user = await User.insert({
      email,
      passwordHash,
    });

    // return user
    return user;
  }

  static async authorize({ email, password }) {
    const existingUser = await User.findByEmail(email);

    if (!existingUser) {
      throw new Error('Invalid email/password');
    }

    const passwordsMatch = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );

    if (!passwordsMatch) {
      throw new Error('Invalid email/password');
    }

    return existingUser;
  }
};
