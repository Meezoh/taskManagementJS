import { createDatabaseConnectionPool } from '../db/connect.js';

const pool = createDatabaseConnectionPool();

export const userTable = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            userId INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            isVerified BOOLEAN NOT NULL DEFAULT FALSE,
            password VARCHAR(64) NOT NULL,
            createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);
    console.log('users table created successfully');
  } catch (error) {
    console.error('Error creating users table:', error.message);
  }
};
