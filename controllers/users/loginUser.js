import { compare } from 'bcrypt';
import { generateJWToken } from '../../middlewares/generateJWToken.js';
import { createDatabaseConnectionPool } from '../../db/connect.js';

const pool = createDatabaseConnectionPool();

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const selectQuery = 'SELECT * FROM users WHERE email = ?';
    const [result] = await pool.query(selectQuery, [email]);
    const user = result[0];

    if (!user || user.length === 0) {
      res.status(401).send('Invalid credentials');
      return;
    }

    const token = generateJWToken(user.userId, user.email);
    await comparePasswords(password, user.password, res, user, token);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send(error.message);
  }
};

const comparePasswords = async (
  enteredPassword,
  hashedPasswordFromDatabase,
  res,
  user,
  JWToken,
) => {
  try {
    const passwordMatch = await compare(
      enteredPassword,
      hashedPasswordFromDatabase,
    );

    if (passwordMatch) {
      res.status(200).send({ JWToken, user });
      console.log(user);
    } else {
      res.status(401).send('Invalid credentials');
      console.log('Authentication failed: Incorrect password');
    }
  } catch (error) {
    console.error('Error during password comparison:', error.message);
    res.status(500).send(error.message);
  }
};
