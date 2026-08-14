import { DataTypes } from 'sequelize';

export default function defineStockIssue(sequelize) {
  return sequelize.define('StockIssue', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    issueNo: { type: DataTypes.STRING(50), allowNull: false, unique: true, field: 'issue_no' },
    issuedAt: { type: DataTypes.DATE, allowNull: false, field: 'issued_at' },
    requester: { type: DataTypes.STRING(150) },
    note: { type: DataTypes.STRING(500) },
    status: { type: DataTypes.ENUM('posted', 'cancelled'), allowNull: false, defaultValue: 'posted' },
    createdBy: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'created_by' },
  }, { tableName: 'stock_issues', underscored: true });
}
