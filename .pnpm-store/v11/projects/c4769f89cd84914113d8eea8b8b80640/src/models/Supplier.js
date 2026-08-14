import { DataTypes } from 'sequelize';

export default function defineSupplier(sequelize) {
  return sequelize.define('Supplier', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    name: { type: DataTypes.STRING(200), allowNull: false },
    contactName: { type: DataTypes.STRING(100), field: 'contact_name' },
    phone: { type: DataTypes.STRING(30) },
    email: { type: DataTypes.STRING(150) },
    address: { type: DataTypes.TEXT },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' },
  }, { tableName: 'suppliers', underscored: true });
}
