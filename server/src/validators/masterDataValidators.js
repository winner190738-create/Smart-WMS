import { body } from 'express-validator';

const optionalDescription = body('description').optional({ nullable: true }).isString().withMessage('Description must be text.').trim().isLength({ max: 500 }).withMessage('Description must not exceed 500 characters.');
const optionalPhone = body('phone').optional({ nullable: true }).matches(/^[0-9+() -]{7,30}$/).withMessage('Phone number is invalid.');
const optionalEmail = body('email').optional({ nullable: true }).isEmail().withMessage('Email must be valid.').normalizeEmail();
const optionalActive = body('isActive').optional().isBoolean().withMessage('isActive must be true or false.').toBoolean();

export const createCategoryValidation = [
  body('name').trim().notEmpty().withMessage('Category name is required.').isLength({ max: 100 }).withMessage('Category name must not exceed 100 characters.'),
  optionalDescription,
];

export const updateCategoryValidation = [
  body('name').optional().trim().notEmpty().withMessage('Category name cannot be empty.').isLength({ max: 100 }).withMessage('Category name must not exceed 100 characters.'),
  optionalDescription,
];

export const createUnitValidation = [
  body('name').trim().notEmpty().withMessage('Unit name is required.').isLength({ max: 50 }).withMessage('Unit name must not exceed 50 characters.'),
  body('abbreviation').trim().notEmpty().withMessage('Unit abbreviation is required.').isLength({ max: 20 }).withMessage('Unit abbreviation must not exceed 20 characters.'),
];

export const updateUnitValidation = [
  body('name').optional().trim().notEmpty().withMessage('Unit name cannot be empty.').isLength({ max: 50 }).withMessage('Unit name must not exceed 50 characters.'),
  body('abbreviation').optional().trim().notEmpty().withMessage('Unit abbreviation cannot be empty.').isLength({ max: 20 }).withMessage('Unit abbreviation must not exceed 20 characters.'),
];

export const createSupplierValidation = [
  body('code').trim().notEmpty().withMessage('Supplier code is required.').isLength({ max: 50 }).withMessage('Supplier code must not exceed 50 characters.'),
  body('name').trim().notEmpty().withMessage('Supplier name is required.').isLength({ max: 200 }).withMessage('Supplier name must not exceed 200 characters.'),
  body('contactName').optional({ nullable: true }).isString().withMessage('Contact name must be text.').trim().isLength({ max: 100 }).withMessage('Contact name must not exceed 100 characters.'),
  optionalPhone,
  optionalEmail,
  body('address').optional({ nullable: true }).isString().withMessage('Address must be text.'),
  optionalActive,
];

export const updateSupplierValidation = [
  body('code').optional().trim().notEmpty().withMessage('Supplier code cannot be empty.').isLength({ max: 50 }).withMessage('Supplier code must not exceed 50 characters.'),
  body('name').optional().trim().notEmpty().withMessage('Supplier name cannot be empty.').isLength({ max: 200 }).withMessage('Supplier name must not exceed 200 characters.'),
  body('contactName').optional({ nullable: true }).isString().withMessage('Contact name must be text.').trim().isLength({ max: 100 }).withMessage('Contact name must not exceed 100 characters.'),
  optionalPhone,
  optionalEmail,
  body('address').optional({ nullable: true }).isString().withMessage('Address must be text.'),
  optionalActive,
];
