import crypto from 'crypto';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { createDatabaseConnectionPool } from '../db/connect.js';

dotenv.config();
const pool = createDatabaseConnectionPool();

export const sendEmail = async (userId, emailSubject, emailMessage, route) => {
  try {
    const selectQuery = 'SELECT email FROM users WHERE userId = ?';
    const [result] = await pool.query(selectQuery, [userId]);
    const { email } = result[0];

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        type: process.env.AUTH_TYPE,
        user: process.env.EMAIL_USERNAME,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: process.env.ACCESS_TOKEN,
      },
    });

    // Generate a unique token
    const token = crypto.randomBytes(20).toString('hex');

    // Store the token and its expiration date in the database
    const tokenExpiry = new Date(Date.now() + 3600000); // Set expiration to 1 hour
    const insertQuery =
      'INSERT INTO verifyUsers (userId, token, tokenExpiry) VALUES (?, ?, ?)';
    await pool.query(insertQuery, [userId, token, tokenExpiry]);

    // Send the verification email
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: emailSubject,
      text: `${emailMessage}: http://localhost:${process.env.PORT}/api/v1/${route}/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error.message);
      } else {
        console.log('Email sent successfully:', info.response);
      }
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};
