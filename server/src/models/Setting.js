import { DataTypes } from 'sequelize';

export default function defineSetting(sequelize) {
  return sequelize.define('Setting', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    key: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    value: { type: DataTypes.TEXT, allowNull: false },
  }, { tableName: 'settings', underscored: true });
}
