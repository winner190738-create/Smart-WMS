import { DataTypes } from 'sequelize';

export default function defineStockReceiptItem(sequelize) {
  return sequelize.define('StockReceiptItem', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    receiptId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'receipt_id' },
    productId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'product_id' },
    quantity: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    unitCost: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'unit_cost' },
  }, { tableName: 'stock_receipt_items', underscored: true });
}
