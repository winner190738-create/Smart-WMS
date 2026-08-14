import sequelize from '../config/database.js';
import defineCategory from './Category.js';
import defineProduct from './Product.js';
import defineSetting from './Setting.js';
import defineStockIssue from './StockIssue.js';
import defineStockIssueItem from './StockIssueItem.js';
import defineStockMovement from './StockMovement.js';
import defineStockReceipt from './StockReceipt.js';
import defineStockReceiptItem from './StockReceiptItem.js';
import defineStockTransaction from './StockTransaction.js';
import defineSupplier from './Supplier.js';
import defineUnit from './Unit.js';
import defineUser from './User.js';
import defineUserSession from './UserSession.js';

const User = defineUser(sequelize);
const Category = defineCategory(sequelize);
const Unit = defineUnit(sequelize);
const Product = defineProduct(sequelize);
const Supplier = defineSupplier(sequelize);
const StockReceipt = defineStockReceipt(sequelize);
const StockReceiptItem = defineStockReceiptItem(sequelize);
const StockIssue = defineStockIssue(sequelize);
const StockIssueItem = defineStockIssueItem(sequelize);
const StockMovement = defineStockMovement(sequelize);
const StockTransaction = defineStockTransaction(sequelize);
const Setting = defineSetting(sequelize);
const UserSession = defineUserSession(sequelize);

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });
Unit.hasMany(Product, { foreignKey: 'unitId' });
Product.belongsTo(Unit, { foreignKey: 'unitId' });
Supplier.hasMany(Product, { foreignKey: 'supplierId' });
Product.belongsTo(Supplier, { foreignKey: 'supplierId' });

Supplier.hasMany(StockReceipt, { foreignKey: 'supplierId' });
StockReceipt.belongsTo(Supplier, { foreignKey: 'supplierId' });
User.hasMany(StockReceipt, { foreignKey: 'createdBy' });
StockReceipt.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
StockReceipt.hasMany(StockReceiptItem, { foreignKey: 'receiptId', as: 'items' });
StockReceiptItem.belongsTo(StockReceipt, { foreignKey: 'receiptId' });
Product.hasMany(StockReceiptItem, { foreignKey: 'productId' });
StockReceiptItem.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(StockIssue, { foreignKey: 'createdBy' });
StockIssue.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
StockIssue.hasMany(StockIssueItem, { foreignKey: 'issueId', as: 'items' });
StockIssueItem.belongsTo(StockIssue, { foreignKey: 'issueId' });
Product.hasMany(StockIssueItem, { foreignKey: 'productId' });
StockIssueItem.belongsTo(Product, { foreignKey: 'productId' });

Product.hasMany(StockMovement, { foreignKey: 'productId' });
StockMovement.belongsTo(Product, { foreignKey: 'productId' });
User.hasMany(StockMovement, { foreignKey: 'performedBy' });
StockMovement.belongsTo(User, { foreignKey: 'performedBy', as: 'performer' });
Product.hasMany(StockTransaction, { foreignKey: 'productId' });
StockTransaction.belongsTo(Product, { foreignKey: 'productId' });
User.hasMany(StockTransaction, { foreignKey: 'userId' });
StockTransaction.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(UserSession, { foreignKey: 'userId' });
UserSession.belongsTo(User, { foreignKey: 'userId' });

export {
  sequelize,
  User,
  Category,
  Unit,
  Product,
  Supplier,
  StockReceipt,
  StockReceiptItem,
  StockIssue,
  StockIssueItem,
  StockMovement,
  StockTransaction,
  Setting,
  UserSession,
};
