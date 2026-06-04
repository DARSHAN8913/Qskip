import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config({path:[ 
          './.env',
          './.env.dev',
          './.env.test',
          './.env.staging',
          './.env.production',
        ]});

  const pool = mysql.createPool({
    host: process.env.DB_HOST ?? "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_USER_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
  // queueLimit: 0,
  });

  pool.on('error', (err) => {
    console.error('MySQL pool error:', {
      message: err.message,
      code: err.code,
      sqlMessage: err.sqlMessage,
    });
  });

export default pool;

