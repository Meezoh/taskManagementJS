import express from 'express';
import { login } from '../controllers/users/loginUser.js';
import { getUsers } from '../controllers/users/getUsers.js';
import { verifyUser } from '../controllers/users/verifyUser.js';
import { verifyJWToken } from '../middlewares/verifyJWToken.js';
import { registerUser } from '../controllers/users/registerUser.js';
import { updatePassword } from '../controllers/users/updatePassword.js';
import { processPassResetURL } from '../controllers/users/processPassResetURL.js';
import { requestPasswordReset } from '../controllers/users/requestPasswordReset.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', registerUser);
router.get('/users', verifyJWToken, getUsers);
router.get('/verify-email/:token', verifyUser);
router.post('/update-password', updatePassword);
router.post('/reset-password', requestPasswordReset);
router.get('/verify-password/:token', processPassResetURL);

export default router;
