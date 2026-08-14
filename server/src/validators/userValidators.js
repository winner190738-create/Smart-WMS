import { body } from 'express-validator';

const userFields = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty.').isLength({ max: 100 }).withMessage('Name must not exceed 100 characters.'),
  body('email').optional().trim().isEmail().withMessage('Email must be valid.').normalizeEmail(),
  body('role').optional().isIn(['admin', 'employee']).withMessage('Role must be admin or employee.'),
  body('isActive').optional().isBoolean().withMessage('isActive must be true or false.').toBoolean(),
  body('password').optional().isString().withMessage('Password must be text.').isLength({ min: 8 }).withMessage('Password must contain at least 8 characters.'),
];

export const createUserValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.').isLength({ max: 100 }).withMessage('Name must not exceed 100 characters.'),
  body('email').trim().isEmail().withMessage('Email must be valid.').normalizeEmail(),
  body('password').isString().withMessage('Password is required.').isLength({ min: 8 }).withMessage('Password must contain at least 8 characters.'),
  body('role').optional().isIn(['admin', 'employee']).withMessage('Role must be admin or employee.'),
  body('isActive').optional().isBoolean().withMessage('isActive must be true or false.').toBoolean(),
];

export const updateUserValidation = userFields;
