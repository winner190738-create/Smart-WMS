import { DataTypes } from 'sequelize';

export default function defineStockMovement(sequelize) {
  return sequelize.define('StockMovement', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    type: { type: DataTypes.ENUM('in', 'out', 'adjustment'), allowNull: false },
    quantity: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    referenceType: { type: DataTypes.ENUM('receipt', 'issue', 'adjustment'), allowNull: false, field: 'reference_type' },
    referenceId: { type: DataTypes.BIGINT.UNSIGNED, field: 'reference_id' },
    note: { type: DataTypes.STRING(500) },
    productId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'product_id' },
    performedBy: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'performed_by' },
    occurredAt: { type: DataTypes.DATE, allowNull: false, field: 'occurred_at' },
  }, { tableName: 'stock_movements', underscored: true });
}
