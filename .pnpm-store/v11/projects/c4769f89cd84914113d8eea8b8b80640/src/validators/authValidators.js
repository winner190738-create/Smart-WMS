import { body } from 'express-validator';

const email = body('email').trim().isEmail().withMessage('Email must be valid.').normalizeEmail();
const password = body('password').isString().withMessage('Password is required.').isLength({ min: 8 }).withMessage('Password must contain at least 8 characters.');

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.').isLength({ max: 100 }).withMessage('Name must not exceed 100 characters.'),
  email,
  password,
];

export const loginValidation = [email, password];
