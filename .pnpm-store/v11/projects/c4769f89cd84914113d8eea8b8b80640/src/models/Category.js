import { DataTypes } from 'sequelize';

export default function defineCategory(sequelize) {
  return sequelize.define('Category', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    description: { type: DataTypes.STRING(500) },
  }, { tableName: 'categories', underscored: true });
}
