export const name = '001-create-initial-schema';

export async function up({ queryInterface, Sequelize }) {
  const timestamps = {
    created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
  };

  await queryInterface.createTable('users', {
    id: { type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING(100), allowNull: false },
    email: { type: Sequelize.STRING(150), allowNull: false, unique: true },
    password_hash: { type: Sequelize.STRING(255), allowNull: false },
    role: { type: Sequelize.ENUM('admin', 'staff'), allowNull: false, defaultValue: 'staff' },
    ...timestamps,
  });
  await queryInterface.createTable('categories', {
    id: { type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
    ...timestamps,
  });
  await queryInterface.createTable('units', {
    id: { type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING(50), allowNull: false, unique: true },
    abbreviation: { type: Sequelize.STRING(20), allowNull: false, unique: true },
    ...timestamps,
  });
  await queryInterface.createTable('products', {
    id: { type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    code: { type: Sequelize.STRING(50), allowNull: false, unique: true },
    barcode: { type: Sequelize.STRING(100), unique: true },
    name: { type: Sequelize.STRING(200), allowNull: false },
    image_url: { type: Sequelize.STRING(500) },
    quantity: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    reorder_point: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    category_id: { type: Sequelize.BIGINT.UNSIGNED, references: { model: 'categories', key: 'id' }, onDelete: 'SET NULL', onUpdate: 'CASCADE' },
    unit_id: { type: Sequelize.BIGINT.UNSIGNED, allowNull: false, references: { model: 'units', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE' },
    ...timestamps,
  });
  await queryInterface.createTable('stock_transactions', {
    id: { type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    type: { type: Sequelize.ENUM('in', 'out'), allowNull: false },
    quantity: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
    note: { type: Sequelize.STRING(500) },
    product_id: { type: Sequelize.BIGINT.UNSIGNED, allowNull: false, references: { model: 'products', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE' },
    user_id: { type: Sequelize.BIGINT.UNSIGNED, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE' },
    ...timestamps,
  });
  await queryInterface.createTable('settings', {
    id: { type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    key: { type: Sequelize.STRING(100), allowNull: false, unique: true },
    value: { type: Sequelize.TEXT, allowNull: false },
    ...timestamps,
  });
  await queryInterface.addIndex('products', ['name']);
  await queryInterface.addIndex('stock_transactions', ['product_id', 'created_at']);
}

export async function down({ queryInterface }) {
  await queryInterface.dropTable('stock_transactions');
  await queryInterface.dropTable('products');
  await queryInterface.dropTable('settings');
  await queryInterface.dropTable('units');
  await queryInterface.dropTable('categories');
  await queryInterface.dropTable('users');
}
