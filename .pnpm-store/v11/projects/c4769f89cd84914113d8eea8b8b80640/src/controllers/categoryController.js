import { Category } from '../models/index.js';
import { createResourceController } from './resourceController.js';

export default createResourceController({
  Model: Category,
  resourceName: 'Category',
  fields: ['name', 'description'],
  order: [['name', 'ASC']],
});
