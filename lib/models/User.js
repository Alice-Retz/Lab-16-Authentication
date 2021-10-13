const pool = require('../utils/pool');
const jwt = require('jsonwebtoken');
const Role = require('./Role');

module.exports = class User {
  id;
  email;
  passwordHash;
  role;

  constructor(row) {
    this.id = row.id;
    this.email = row.email;
    this.passwordHash = row.password_hash;
    this.role = row.role;
  }
  //This is where I removed the curly braces
  static async insert(email, passwordHash, roleTitle) {
    const foundRole = await Role.findByTitle(roleTitle);
    const { rows } = await pool.query(
      'INSERT INTO users (email, password_hash, role_id) VALUES ($1, $2, $3) RETURNING *',
      [email, passwordHash, foundRole.id]
    );

    return new User({ ...rows[0], role: foundRole.title });
  }

  static async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [
      email,
    ]);

    if (!rows[0]) return null;

    const role = await Role.findById(rows[0].role_id);

    return new User({ ...rows[0], role: role.title });
  }

  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [
      id,
    ]);

    if (!rows[0]) return null;

    return new User(rows[0]);
  }

  static async updateRole(id, { email, passwordHash, roleTitle }) {
    const currentRole = await Role.findByTitle(roleTitle);

    const { rows } = await pool.query(
      `UPDATE users
      SET email = $2, password_hash = $3, role_id = $4
      WHERE id = $1 RETURNING *`,
      [id, email, passwordHash, currentRole.id]
    );

    return new User({ ...rows[0], role: currentRole.title });
  }

  authToken() {
    return jwt.sign(this.toJSON(), process.env.APP_SECRET, {
      expiresIn: '24h',
    });
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      role: this.role,
    };
  }
};
