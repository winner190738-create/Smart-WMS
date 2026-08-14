import { DataTypes } from 'sequelize';

export default function defineProduct(sequelize) {
  return sequelize.define('Product', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    barcode: { type: DataTypes.STRING(100), unique: true },
    name: { type: DataTypes.STRING(200), allowNull: false },
    imageUrl: { type: DataTypes.STRING(500), field: 'image_url' },
    quantity: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    reorderPoint: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'reorder_point' },
    categoryId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true, field: 'category_id' },
    unitId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'unit_id' },
    supplierId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true, field: 'supplier_id' },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' },
  }, { tableName: 'products', underscored: true });
}
