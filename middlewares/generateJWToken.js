import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const generateJWToken = (userId, email) => {
  try {
    const user = {
      userId,
      email,
    };

    const token = jwt.sign(user, process.env.JWT_TOKEN_KEY, {
      expiresIn: '30d',
    });
    return token;
  } catch (error) {
    console.error('Error generating JWToken:', error.message);
  }
};
