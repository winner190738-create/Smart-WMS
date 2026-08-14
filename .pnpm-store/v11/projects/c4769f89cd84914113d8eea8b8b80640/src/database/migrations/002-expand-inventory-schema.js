export const name = '002-expand-inventory-schema';

const timestamps = (Sequelize) => ({
  created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
  updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
});

export async function up({ queryInterface, Sequelize, transaction }) {
  await queryInterface.changeColumn('users', 'role', {
    type: Sequelize.ENUM('admin', 'staff', 'employee'),
    allowNull: false,
    defaultValue: 'employee',
  }, { transaction });
  await queryInterface.sequelize.query("UPDATE users SET role = 'employee' WHERE role = 'staff'", { transaction });
  await queryInterface.changeColumn('users', 'role', {
    type: Sequelize.ENUM('admin', 'employee'),
    allowNull: false,
    defaultValue: 'employee',
  }, { transaction });
  await queryInterface.addColumn('users', 'is_active', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  }, { transaction });
  await queryInterface.addColumn('categories', 'description', {
    type: Sequelize.STRING(500),
  }, { transaction });

  await queryInterface.createTable('suppliers', {
    id: { type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    code: { type: Sequelize.STRING(50), allowNull: false, unique: true },
    name: { type: Sequelize.STRING(200), allowNull: false },
    contact_name: { type: Sequelize.STRING(100) },
    phone: { type: Sequelize.STRING(30) },
    email: { type: Sequelize.STRING(150) },
    address: { type: Sequelize.TEXT },
    is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    ...timestamps(Sequelize),
  }, { transaction });
  await queryInterface.addColumn('products', 'supplier_id', {
    type: Sequelize.BIGINT.UNSIGNED,
    references: { model: 'suppliers', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  }, { transaction });
  await queryInterface.addColumn('products', 'is_active', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  }, { transaction });

  await queryInterface.createTable('stock_receipts', {
    id: { type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    receipt_no: { type: Sequelize.STRING(50), allowNull: false, unique: true },
    supplier_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      references: { model: 'suppliers', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    received_at: { type: Sequelize.DATE, allowNull: false },
    note: { type: Sequelize.STRING(500) },
    status: { type: Sequelize.ENUM('posted', 'cancelled'), allowNull: false, defaultValue: 'posted' },
    created_by: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    ...timestamps(Sequelize),
  }, { transaction });
  await queryInterface.createTable('stock_receipt_items', {
    id: { type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    receipt_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      references: { model: 'stock_receipts', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    product_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      references: { model: 'products', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    quantity: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
    unit_cost: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    ...timestamps(Sequelize),
  }, { transaction });

  await queryInterface.createTable('stock_issues', {
    id: { type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    issue_no: { type: Sequelize.STRING(50), allowNull: false, unique: true },
    issued_at: { type: Sequelize.DATE, allowNull: false },
    requester: { type: Sequelize.STRING(150) },
    note: { type: Sequelize.STRING(500) },
    status: { type: Sequelize.ENUM('posted', 'cancelled'), allowNull: false, defaultValue: 'posted' },
    created_by: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    ...timestamps(Sequelize),
  }, { transaction });
  await queryInterface.createTable('stock_issue_items', {
    id: { type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    issue_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      references: { model: 'stock_issues', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    product_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      references: { model: 'products', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    quantity: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
    ...timestamps(Sequelize),
  }, { transaction });

  await queryInterface.createTable('stock_movements', {
    id: { type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    type: { type: Sequelize.ENUM('in', 'out', 'adjustment'), allowNull: false },
    quantity: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
    reference_type: { type: Sequelize.ENUM('receipt', 'issue', 'adjustment'), allowNull: false },
    reference_id: { type: Sequelize.BIGINT.UNSIGNED },
    note: { type: Sequelize.STRING(500) },
    product_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      references: { model: 'products', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    performed_by: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    occurred_at: { type: Sequelize.DATE, allowNull: false },
    ...timestamps(Sequelize),
  }, { transaction });
  await queryInterface.createTable('user_sessions', {
    id: { type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    user_id: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    token_identifier: { type: Sequelize.STRING(100), allowNull: false, unique: true },
    expires_at: { type: Sequelize.DATE, allowNull: false },
    revoked_at: { type: Sequelize.DATE },
    ...timestamps(Sequelize),
  }, { transaction });

  await queryInterface.addIndex('suppliers', ['name'], { name: 'suppliers_name_idx', transaction });
  await queryInterface.addIndex('products', ['supplier_id'], { name: 'products_supplier_id_idx', transaction });
  await queryInterface.addIndex('stock_receipts', ['supplier_id', 'received_at'], { name: 'stock_receipts_supplier_date_idx', transaction });
  await queryInterface.addIndex('stock_receipts', ['created_by'], { name: 'stock_receipts_created_by_idx', transaction });
  await queryInterface.addIndex('stock_receipt_items', ['receipt_id', 'product_id'], { name: 'stock_receipt_items_receipt_product_idx', transaction });
  await queryInterface.addIndex('stock_issues', ['issued_at'], { name: 'stock_issues_issued_at_idx', transaction });
  await queryInterface.addIndex('stock_issues', ['created_by'], { name: 'stock_issues_created_by_idx', transaction });
  await queryInterface.addIndex('stock_issue_items', ['issue_id', 'product_id'], { name: 'stock_issue_items_issue_product_idx', transaction });
  await queryInterface.addIndex('stock_movements', ['product_id', 'occurred_at'], { name: 'stock_movements_product_date_idx', transaction });
  await queryInterface.addIndex('stock_movements', ['type', 'occurred_at'], { name: 'stock_movements_type_date_idx', transaction });
  await queryInterface.addIndex('user_sessions', ['user_id', 'expires_at'], { name: 'user_sessions_user_expires_idx', transaction });
}

export async function down({ queryInterface, Sequelize, transaction }) {
  await queryInterface.dropTable('user_sessions', { transaction });
  await queryInterface.dropTable('stock_movements', { transaction });
  await queryInterface.dropTable('stock_issue_items', { transaction });
  await queryInterface.dropTable('stock_issues', { transaction });
  await queryInterface.dropTable('stock_receipt_items', { transaction });
  await queryInterface.dropTable('stock_receipts', { transaction });
  await queryInterface.removeColumn('products', 'is_active', { transaction });
  await queryInterface.removeColumn('products', 'supplier_id', { transaction });
  await queryInterface.dropTable('suppliers', { transaction });
  await queryInterface.removeColumn('categories', 'description', { transaction });
  await queryInterface.removeColumn('users', 'is_active', { transaction });
  await queryInterface.changeColumn('users', 'role', {
    type: Sequelize.ENUM('admin', 'staff', 'employee'),
    allowNull: false,
    defaultValue: 'staff',
  }, { transaction });
  await queryInterface.sequelize.query("UPDATE users SET role = 'staff' WHERE role = 'employee'", { transaction });
  await queryInterface.changeColumn('users', 'role', {
    type: Sequelize.ENUM('admin', 'staff'),
    allowNull: false,
    defaultValue: 'staff',
  }, { transaction });
}
