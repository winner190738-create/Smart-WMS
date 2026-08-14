import 'dotenv/config';
import { Sequelize } from 'sequelize';
import sequelize from '../config/database.js';
import * as initialSchema from './migrations/001-create-initial-schema.js';
import * as inventorySchema from './migrations/002-expand-inventory-schema.js';

const migrations = [initialSchema, inventorySchema];

async function migrate() {
  await sequelize.authenticate();
  const queryInterface = sequelize.getQueryInterface();
  const tables = await queryInterface.showAllTables();
  const hasMigrationTable = tables.some((table) => {
    const tableName = typeof table === 'object' ? table.tableName : table;
    return String(tableName).toLowerCase() === 'schema_migrations';
  });

  if (!hasMigrationTable) {
    await queryInterface.createTable('schema_migrations', {
      name: { type: Sequelize.STRING(100), primaryKey: true },
      executed_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  }
  const [executed] = await sequelize.query('SELECT name FROM schema_migrations');

  for (const migration of migrations) {
    if (!executed.some((entry) => entry.name === migration.name)) {
      await sequelize.transaction(async (transaction) => {
        await migration.up({ queryInterface: sequelize.getQueryInterface(), Sequelize, transaction });
        await sequelize.getQueryInterface().bulkInsert('schema_migrations', [{ name: migration.name }], { transaction });
      });
      console.log(`Applied migration: ${migration.name}`);
    }
  }
}

migrate()
  .then(() => sequelize.close())
  .catch(async (error) => { console.error(error); await sequelize.close(); process.exitCode = 1; });
