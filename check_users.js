require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function checkUsers() {
    try {
        const res = await pool.query('SELECT name, email, role FROM users');
        console.log('Users in Database:');
        console.table(res.rows);
    } catch (err) {
        console.error('Error checking users:', err.message);
    } finally {
        await pool.end();
    }
}

checkUsers();
