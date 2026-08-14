import { Router } from 'express';
import { login, logout, register } from '../controllers/authController.js';
import verifyToken from '../middleware/verifyToken.js';
import validateRequest from '../middleware/validateRequest.js';
import { loginValidation, registerValidation } from '../validators/authValidators.js';

const router = Router();

router.post('/register', ...registerValidation, validateRequest, register);
router.post('/login', ...loginValidation, validateRequest, login);
router.post('/logout', verifyToken, logout);

export default router;
