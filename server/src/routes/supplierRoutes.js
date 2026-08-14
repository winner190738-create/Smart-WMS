import { Router } from 'express';
import controller from '../controllers/supplierController.js';
import validateRequest from '../middleware/validateRequest.js';
import { idParameter } from '../validators/commonValidators.js';
import { createSupplierValidation, updateSupplierValidation } from '../validators/masterDataValidators.js';

const router = Router();

router.get('/', controller.list);
router.post('/', ...createSupplierValidation, validateRequest, controller.create);
router.get('/:id', ...idParameter, validateRequest, controller.getById);
router.put('/:id', ...idParameter, ...updateSupplierValidation, validateRequest, controller.update);
router.delete('/:id', ...idParameter, validateRequest, controller.remove);

export default router;
