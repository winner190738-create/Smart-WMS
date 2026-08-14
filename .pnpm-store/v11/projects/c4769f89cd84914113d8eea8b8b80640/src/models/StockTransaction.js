import { DataTypes } from 'sequelize';

export default function defineStockTransaction(sequelize) {
  return sequelize.define('StockTransaction', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    type: { type: DataTypes.ENUM('in', 'out'), allowNull: false },
    quantity: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    note: { type: DataTypes.STRING(500) },
    productId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'product_id' },
    userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'user_id' },
  }, { tableName: 'stock_transactions', underscored: true });
}
