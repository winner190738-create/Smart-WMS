import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from '../controllers/productController.js';
import validateRequest from '../middleware/validateRequest.js';
import { idParameter } from '../validators/commonValidators.js';
import { createProductValidation, productQueryValidation, updateProductValidation } from '../validators/productValidators.js';

const router = Router();

router.get('/', ...productQueryValidation, validateRequest, listProducts);
router.post('/', ...createProductValidation, validateRequest, createProduct);
router.get('/:id', ...idParameter, validateRequest, getProduct);
router.put('/:id', ...idParameter, ...updateProductValidation, validateRequest, updateProduct);
router.delete('/:id', ...idParameter, validateRequest, deleteProduct);

export default router;
