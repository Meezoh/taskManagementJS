import { createDatabaseConnectionPool } from '../../db/connect.js';

const pool = createDatabaseConnectionPool();

export const processPassResetURL = async (req, res) => {
  try {
    const { token } = req.params;

    const selectQuery =
      'SELECT userId FROM verifyUsers WHERE token = ? AND tokenExpiry > NOW()';
    const [result] = await pool.query(selectQuery, [token]);

    if (!result || result.length === 0) {
      return res.status(400).send('Invalid or expired token');
    }

    const userId = result[0];

    const deleteTokenQuery =
      'DELETE FROM verifyUsers WHERE userId = ? AND token = ?';
    await pool.query(deleteTokenQuery, [userId, token]);

    res.status(200).send(userId);
  } catch (error) {
    console.error('Error confirming token validity:', error);
    return res.status(500).send(error.message);
  }
};
