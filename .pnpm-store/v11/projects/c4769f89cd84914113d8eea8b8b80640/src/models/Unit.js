import { DataTypes } from 'sequelize';

export default function defineUnit(sequelize) {
  return sequelize.define('Unit', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    abbreviation: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  }, { tableName: 'units', underscored: true });
}
