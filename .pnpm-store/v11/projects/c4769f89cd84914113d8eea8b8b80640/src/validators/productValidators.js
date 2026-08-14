import { body, query } from 'express-validator';

const optionalString = (field, label, max) => body(field)
  .optional({ nullable: true })
  .isString().withMessage(`${label} must be text.`)
  .trim()
  .isLength({ max }).withMessage(`${label} must not exceed ${max} characters.`);

const optionalForeignKey = (field, label) => body(field)
  .optional({ nullable: true })
  .isInt({ min: 1 }).withMessage(`${label} must be a positive integer.`)
  .toInt();

const productFields = [
  optionalString('code', 'Product code', 50),
  optionalString('barcode', 'Barcode', 100),
  optionalString('name', 'Product name', 200),
  optionalString('imageUrl', 'Image URL', 500).isURL().withMessage('Image URL must be valid.'),
  body('reorderPoint').optional().isFloat({ min: 0 }).withMessage('Reorder point must be zero or greater.').toFloat(),
  optionalForeignKey('categoryId', 'Category ID'),
  optionalForeignKey('unitId', 'Unit ID'),
  optionalForeignKey('supplierId', 'Supplier ID'),
  body('isActive').optional().isBoolean().withMessage('isActive must be true or false.').toBoolean(),
];

export const createProductValidation = [
  body('code').trim().notEmpty().withMessage('Product code is required.').isLength({ max: 50 }).withMessage('Product code must not exceed 50 characters.'),
  body('name').trim().notEmpty().withMessage('Product name is required.').isLength({ max: 200 }).withMessage('Product name must not exceed 200 characters.'),
  body('unitId').isInt({ min: 1 }).withMessage('Unit ID must be a positive integer.').toInt(),
  ...productFields.slice(1),
];

export const updateProductValidation = productFields;

export const productQueryValidation = [
  query('search').optional().isString().withMessage('Search must be text.').trim().isLength({ max: 200 }).withMessage('Search must not exceed 200 characters.'),
  query('categoryId').optional().isInt({ min: 1 }).withMessage('categoryId must be a positive integer.').toInt(),
  query('supplierId').optional().isInt({ min: 1 }).withMessage('supplierId must be a positive integer.').toInt(),
  query('includeInactive').optional().isBoolean().withMessage('includeInactive must be true or false.').toBoolean(),
];
