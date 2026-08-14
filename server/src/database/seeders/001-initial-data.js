import bcrypt from 'bcrypt';
import { Category, Setting, Supplier, Unit, User } from '../../models/index.js';

export default async function seedInitialData() {
  await Unit.bulkCreate([
    { name: 'Piece', abbreviation: 'pc' },
    { name: 'Box', abbreviation: 'box' },
    { name: 'Pack', abbreviation: 'pack' },
  ], { ignoreDuplicates: true });
  await Category.findOrCreate({
    where: { name: 'General' },
    defaults: { description: 'Default product category' },
  });
  await Supplier.findOrCreate({
    where: { code: 'SUP-DEFAULT' },
    defaults: { name: 'Default Supplier' },
  });
  await Setting.findOrCreate({
    where: { key: 'warehouse_name' },
    defaults: { value: 'Smart WMS Warehouse' },
  });
  await User.findOrCreate({
    where: { email: 'admin@smartwms.local' },
    defaults: {
      name: 'System Administrator',
      passwordHash: await bcrypt.hash('ChangeMe123!', 10),
      role: 'admin',
    },
  });
}
