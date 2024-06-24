import { createDatabaseConnectionPool } from '../db/connect.js';

const pool = createDatabaseConnectionPool();

export const verifyUserTable = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS verifyUsers (
            verifyUserId INT AUTO_INCREMENT PRIMARY KEY,
            userId INT NOT NULL,
            token VARCHAR(255) NOT NULL,
            tokenExpiry DATETIME NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(userId)
        )
    `);
    console.log('verifyUsers table created successfully');
  } catch (error) {
    console.error('Error creating verifyUsers table: ', error.message);
  }
};
