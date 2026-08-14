import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getUser,
  listUsers,
  updateUser,
} from '../controllers/userController.js';
import validateRequest from '../middleware/validateRequest.js';
import { idParameter } from '../validators/commonValidators.js';
import { createUserValidation, updateUserValidation } from '../validators/userValidators.js';

const router = Router();

router.get('/', listUsers);
router.post('/', ...createUserValidation, validateRequest, createUser);
router.get('/:id', ...idParameter, validateRequest, getUser);
router.put('/:id', ...idParameter, ...updateUserValidation, validateRequest, updateUser);
router.delete('/:id', ...idParameter, validateRequest, deleteUser);

export default router;
