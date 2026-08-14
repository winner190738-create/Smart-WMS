import { Router } from 'express';
import {
  createIssue,
  createReceipt,
  getIssue,
  getReceipt,
  listIssues,
  listReceipts,
} from '../controllers/stockController.js';
import validateRequest from '../middleware/validateRequest.js';
import { idParameter } from '../validators/commonValidators.js';
import { createIssueValidation, createReceiptValidation, stockDateRangeValidation } from '../validators/stockValidators.js';

const router = Router();

router.get('/receipts', ...stockDateRangeValidation, validateRequest, listReceipts);
router.post('/receipts', ...createReceiptValidation, validateRequest, createReceipt);
router.get('/receipts/:id', ...idParameter, validateRequest, getReceipt);
router.get('/issues', ...stockDateRangeValidation, validateRequest, listIssues);
router.post('/issues', ...createIssueValidation, validateRequest, createIssue);
router.get('/issues/:id', ...idParameter, validateRequest, getIssue);

export default router;
