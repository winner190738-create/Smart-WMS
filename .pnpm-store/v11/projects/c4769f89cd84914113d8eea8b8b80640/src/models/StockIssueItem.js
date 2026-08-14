import { DataTypes } from 'sequelize';

export default function defineStockIssueItem(sequelize) {
  return sequelize.define('StockIssueItem', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    issueId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'issue_id' },
    productId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'product_id' },
    quantity: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  }, { tableName: 'stock_issue_items', underscored: true });
}
