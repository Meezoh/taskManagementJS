import { sendEmail } from '../../services/sendEmail.js';
import { createDatabaseConnectionPool } from '../../db/connect.js';

const pool = createDatabaseConnectionPool();

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [
      email,
    ]);
    const id = user[0].userId;

    const emailSubject = 'Password Reset';
    const emailMessage = 'Click on the following link to reset your password';
    const route = 'verify-password';

    const emailSent = await sendEmail(id, emailSubject, emailMessage, route);
    if (!emailSent) {
      throw new Error('Error sending password reset email');
    }

    res.send({
      status: 200,
      message: 'Password reset token sent successfully',
    });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.send({ status: 500, message: error.message });
  }
};
