import { hash } from 'bcrypt';
import { createDatabaseConnectionPool } from '../../db/connect.js';

const pool = createDatabaseConnectionPool();

export const updatePassword = async (req, res) => {
  try {
    const { password, userId } = req.body;

    const hashedPassword = await hash(password, 10);

    // Update the user's password and delete the token from the database
    const updateQuery = 'UPDATE users SET password = ? WHERE userId = ?';

    await pool.query(updateQuery, [hashedPassword, userId]);

    res.status(200).send('Password reset successful');
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).send(error.message);
  }
};
