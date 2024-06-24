import dotenv from 'dotenv';
import { hash } from 'bcrypt';
import { sendEmail } from '../../services/sendEmail.js';
import { createDatabaseConnectionPool } from '../../db/connect.js';
import { generateJWToken } from '../../middlewares/generateJWToken.js';

dotenv.config();
const saltRounds = 10;
const pool = createDatabaseConnectionPool();

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await hash(password, saltRounds);

    // Perform the database insertion
    const insertQuery =
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    const [result] = await pool.query(insertQuery, [
      username,
      email,
      hashedPassword,
    ]);

    // Query the newly created user
    const id = result.insertId;
    const [user] = await pool.query('SELECT * FROM users WHERE userId = ?', [
      id,
    ]);

    const JWToken = generateJWToken(id, email);

    const emailSubject = 'Email Verification';
    const emailMessage = 'Click on the following link to verify your email';
    const route = 'verify-email';

    const emailSent = sendEmail(id, emailSubject, emailMessage, route);
    if (!emailSent) {
      throw new Error('Error sending verification email');
    }

    res.status(200).send({ JWToken, user });
  } catch (error) {
    console.error('Error Registering User:', error.message);
    res.send({ status: 500, message: error.message });
  }
};
