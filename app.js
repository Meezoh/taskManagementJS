import express from 'express';
// import dotenv from 'dotenv';
import { createTables } from './db/createTables.js';
import 'express-async-errors';
import usersRoutes from './routes/usersRoutes.js';

const app = express();
// dotenv.config();

app.use(express.json());

app.use('/api/v1', usersRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 9090;
const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      // createTables();
    });
  } catch (error) {
    console.log(error);
  }
};
start();
