import dotenv from 'dotenv';
import { createDatabaseConnectionPool } from '../../db/connect.js';

dotenv.config();
const pool = createDatabaseConnectionPool();

// This helps users verify email when the link is clicked
export const verifyUser = async (req, res) => {
  try {
    const { token } = req.params;

    const selectQuery =
      'SELECT userId FROM verifyUsers WHERE token = ? AND tokenExpiry > NOW()';
    const [result] = await pool.query(selectQuery, [token]);

    if (!result || result.length === 0) {
      return res.status(400).send('Invalid or expired token');
    }

    const { userId } = result[0];
    const updateQuery = 'UPDATE users SET isVerified = TRUE WHERE userId = ?';
    await pool.query(updateQuery, [userId]);

    const deleteQuery = 'DELETE FROM verifyUsers WHERE token = ?';
    await pool.query(deleteQuery, [token]);

    res.status(200).send('Email verified successfully');
  } catch (error) {
    console.error('Error validating user token:', error.message);
    res.status(500).send(error.message);
  }
};
