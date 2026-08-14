import { Router } from 'express';
import {
  getInventoryReport,
  getIssueReport,
  getReceiptReport,
} from '../controllers/dashboardReportController.js';
import validateRequest from '../middleware/validateRequest.js';
import { stockDateRangeValidation } from '../validators/stockValidators.js';
import { productQueryValidation } from '../validators/productValidators.js';

const router = Router();

router.get('/receipts', ...stockDateRangeValidation, validateRequest, getReceiptReport);
router.get('/issues', ...stockDateRangeValidation, validateRequest, getIssueReport);
router.get('/inventory', ...productQueryValidation, validateRequest, getInventoryReport);

export default router;
