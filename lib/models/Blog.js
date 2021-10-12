const pool = require('../utils/pool');

module.exports = class Blog {
  id;
  userId;
  text;

  constructor(row) {
    this.id = row.id;
    this.userId = row.user_id;
    this.text = row.text;
  }

  static async insert({ userId, text }) {
    const { rows } = await pool.query(
      'INSERT INTO blogs (user_id, text) VALUES ($1, $2) RETURNING *',
      [userId, text]
    );

    return new Blog(rows[0]);
  }
};
