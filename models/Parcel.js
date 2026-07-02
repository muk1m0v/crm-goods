const pool = require('../config/db');

class Parcel {
  static async create({ user_id, weight, cube, username, full_name, phone, cargo_name, tracking_number, paid, status }) {
    const result = await pool.query(
      `INSERT INTO parcels (user_id, weight, cube, username, full_name, phone, cargo_name, tracking_number, paid, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [user_id, weight, cube || null, username, full_name, phone, cargo_name, tracking_number, paid || false, status || 'принять на склад в китае']
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM parcels WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await pool.query('SELECT * FROM parcels WHERE user_id = $1 ORDER BY id DESC', [userId]);
    return result.rows;
  }

  static async getAll() {
    const result = await pool.query('SELECT * FROM parcels ORDER BY id DESC');
    return result.rows;
  }

  static async update(id, { weight, cube, cargo_name, tracking_number, paid, status }) {
    const result = await pool.query(
      `UPDATE parcels 
       SET weight = $1, cube = $2, cargo_name = $3, tracking_number = $4, paid = $5, status = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 RETURNING *`,
      [weight, cube || null, cargo_name, tracking_number, paid || false, status, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM parcels WHERE id = $1', [id]);
  }
}

module.exports = Parcel;