import { Router } from 'express';
import controller from '../controllers/categoryController.js';
import validateRequest from '../middleware/validateRequest.js';
import { idParameter } from '../validators/commonValidators.js';
import { createCategoryValidation, updateCategoryValidation } from '../validators/masterDataValidators.js';

const router = Router();

router.get('/', controller.list);
router.post('/', ...createCategoryValidation, validateRequest, controller.create);
router.get('/:id', ...idParameter, validateRequest, controller.getById);
router.put('/:id', ...idParameter, ...updateCategoryValidation, validateRequest, controller.update);
router.delete('/:id', ...idParameter, validateRequest, controller.remove);

export default router;
