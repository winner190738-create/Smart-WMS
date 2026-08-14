import { Router } from 'express';
import controller from '../controllers/unitController.js';
import validateRequest from '../middleware/validateRequest.js';
import { idParameter } from '../validators/commonValidators.js';
import { createUnitValidation, updateUnitValidation } from '../validators/masterDataValidators.js';

const router = Router();

router.get('/', controller.list);
router.post('/', ...createUnitValidation, validateRequest, controller.create);
router.get('/:id', ...idParameter, validateRequest, controller.getById);
router.put('/:id', ...idParameter, ...updateUnitValidation, validateRequest, controller.update);
router.delete('/:id', ...idParameter, validateRequest, controller.remove);

export default router;
