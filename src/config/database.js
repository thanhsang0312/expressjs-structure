const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'express_auth',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Convert pool to promise-based
const promisePool = pool.promise();

module.exports = promisePool; 