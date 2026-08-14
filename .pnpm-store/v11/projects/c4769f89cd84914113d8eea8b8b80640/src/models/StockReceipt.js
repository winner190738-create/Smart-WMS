import { DataTypes } from 'sequelize';

export default function defineStockReceipt(sequelize) {
  return sequelize.define('StockReceipt', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    receiptNo: { type: DataTypes.STRING(50), allowNull: false, unique: true, field: 'receipt_no' },
    supplierId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'supplier_id' },
    receivedAt: { type: DataTypes.DATE, allowNull: false, field: 'received_at' },
    note: { type: DataTypes.STRING(500) },
    status: { type: DataTypes.ENUM('posted', 'cancelled'), allowNull: false, defaultValue: 'posted' },
    createdBy: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'created_by' },
  }, { tableName: 'stock_receipts', underscored: true });
}
