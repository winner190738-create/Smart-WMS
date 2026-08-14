import { Router } from 'express';
import { getDashboardSummary } from '../controllers/dashboardReportController.js';
import validateRequest from '../middleware/validateRequest.js';
import { dashboardDateRangeValidation } from '../validators/stockValidators.js';

const router = Router();

router.get('/summary', ...dashboardDateRangeValidation, validateRequest, getDashboardSummary);

export default router;
