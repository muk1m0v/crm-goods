const pool = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  static async findByUsername(username) {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  }

  static async create({ username, password, full_name, phone, role = 'user' }) {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (username, password_hash, full_name, phone, role)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, username, full_name, phone, role`,
      [username, hashed, full_name, phone, role]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query('SELECT id, username, full_name, phone, role FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async update(id, { full_name, phone, role }) {
    const result = await pool.query(
      `UPDATE users SET full_name = $1, phone = $2, role = $3 WHERE id = $4 RETURNING id, username, full_name, phone, role`,
      [full_name, phone, role, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  }

  static async getAll() {
    const result = await pool.query('SELECT id, username, full_name, phone, role FROM users ORDER BY id');
    return result.rows;
  }
}

module.exports = User;