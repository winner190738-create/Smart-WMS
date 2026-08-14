import { Unit } from '../models/index.js';
import { createResourceController } from './resourceController.js';

export default createResourceController({
  Model: Unit,
  resourceName: 'Unit',
  fields: ['name', 'abbreviation'],
  order: [['name', 'ASC']],
});
