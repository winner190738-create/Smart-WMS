import { body, query } from 'express-validator';

const stockItems = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required.'),
  body('items.*.productId').isInt({ min: 1 }).withMessage('Product ID must be a positive integer.').toInt(),
  body('items.*.quantity').isFloat({ gt: 0 }).withMessage('Quantity must be greater than zero.').toFloat(),
];

const dateRange = [
  query('dateFrom').optional().isISO8601().withMessage('dateFrom must be a valid ISO 8601 date.'),
  query('dateTo').optional().isISO8601().withMessage('dateTo must be a valid ISO 8601 date.'),
];

export const createReceiptValidation = [
  body('supplierId').isInt({ min: 1 }).withMessage('Supplier ID must be a positive integer.').toInt(),
  body('receivedAt').optional().isISO8601().withMessage('receivedAt must be a valid ISO 8601 date.'),
  body('note').optional({ nullable: true }).isString().withMessage('Note must be text.').trim().isLength({ max: 500 }).withMessage('Note must not exceed 500 characters.'),
  ...stockItems,
  body('items.*.unitCost').optional().isFloat({ min: 0 }).withMessage('Unit cost must be zero or greater.').toFloat(),
];

export const createIssueValidation = [
  body('issuedAt').optional().isISO8601().withMessage('issuedAt must be a valid ISO 8601 date.'),
  body('requester').optional({ nullable: true }).isString().withMessage('Requester must be text.').trim().isLength({ max: 150 }).withMessage('Requester must not exceed 150 characters.'),
  body('note').optional({ nullable: true }).isString().withMessage('Note must be text.').trim().isLength({ max: 500 }).withMessage('Note must not exceed 500 characters.'),
  ...stockItems,
];

export const stockDateRangeValidation = dateRange;
export const dashboardDateRangeValidation = dateRange;
