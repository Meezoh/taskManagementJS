import { createDatabaseConnectionPool } from '../db/connect.js';

const pool = createDatabaseConnectionPool();

export const taskTable = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
            taskId INT AUTO_INCREMENT PRIMARY KEY,
            userId INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            status ENUM('To Do', 'In Progress', 'Done') NOT NULL DEFAULT 'To Do',
            dueDate DATETIME,
            createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY(userId) REFERENCES users (userId)
        )
    `);
    console.log('tasks table created successfully');
  } catch (error) {
    console.error('Error creating tasks table: ', error.message);
  }
};
