require('dotenv').config();
const pool = require('../config/db');
const bcrypt = require('bcrypt');

(async () => {
    const username = 'Superadmin';
    const password = 'ADMIN707';
    const hashed = await bcrypt.hash(password, 10);
    try {
        await pool.query(
            `INSERT INTO users (username, password_hash, full_name, phone, role)
             VALUES ($1, $2, 'Super Admin', '+1234567890', 'admin')`,
            [username, hashed]
        );
        console.log('Суперадмин создан!');
    } catch (err) {
        console.error('Ошибка:', err.message);
    } finally {
        pool.end();
    }
})();