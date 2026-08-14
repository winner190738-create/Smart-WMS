import { DataTypes } from 'sequelize';

export default function defineUserSession(sequelize) {
  return sequelize.define('UserSession', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'user_id' },
    tokenIdentifier: { type: DataTypes.STRING(100), allowNull: false, unique: true, field: 'token_identifier' },
    expiresAt: { type: DataTypes.DATE, allowNull: false, field: 'expires_at' },
    revokedAt: { type: DataTypes.DATE, field: 'revoked_at' },
  }, { tableName: 'user_sessions', underscored: true });
}
