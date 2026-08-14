import { Supplier } from '../models/index.js';
import { createResourceController } from './resourceController.js';

export default createResourceController({
  Model: Supplier,
  resourceName: 'Supplier',
  fields: ['code', 'name', 'contactName', 'phone', 'email', 'address', 'isActive'],
  order: [['name', 'ASC']],
});
