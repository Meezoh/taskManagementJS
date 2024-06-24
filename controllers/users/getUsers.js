import { createDatabaseConnectionPool } from '../../db/connect.js';

const pool = createDatabaseConnectionPool();

export const getUsers = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT * FROM users');
    res.send(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).send('Internal Server Error');
  }
};
