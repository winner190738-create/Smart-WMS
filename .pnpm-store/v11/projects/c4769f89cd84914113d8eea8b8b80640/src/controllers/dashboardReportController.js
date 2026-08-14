import { Op } from 'sequelize';
import {
  Category,
  Product,
  StockIssue,
  StockIssueItem,
  StockMovement,
  StockReceipt,
  StockReceiptItem,
  Supplier,
  Unit,
  User,
} from '../models/index.js';
import { sendSuccess } from '../utils/apiResponse.js';
import handleControllerError from '../utils/controllerError.js';

const receiptIncludes = [
  { model: Supplier, attributes: ['id', 'code', 'name'] },
  { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
  { model: StockReceiptItem, as: 'items', include: [{ model: Product, attributes: ['id', 'code', 'name'] }] },
];

const issueIncludes = [
  { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
  { model: StockIssueItem, as: 'items', include: [{ model: Product, attributes: ['id', 'code', 'name'] }] },
];

function getDateFilter(query, field) {
  const range = {};
  if (query.dateFrom) {
    range[Op.gte] = new Date(`${query.dateFrom}T00:00:00.000Z`);
  }
  if (query.dateTo) {
    range[Op.lte] = new Date(`${query.dateTo}T23:59:59.999Z`);
  }
  return Object.keys(range).length ? { [field]: range } : {};
}

export async function getDashboardSummary(request, response) {
  try {
    const movementDateFilter = getDateFilter(request.query, 'occurredAt');
    const [totalProducts, inventory, stockInQuantity, stockOutQuantity] = await Promise.all([
      Product.count({ where: { isActive: true } }),
      Product.findAll({
        where: { isActive: true },
        attributes: ['id', 'code', 'name', 'quantity', 'reorderPoint'],
        order: [['name', 'ASC']],
      }),
      StockMovement.sum('quantity', { where: { type: 'in', ...movementDateFilter } }),
      StockMovement.sum('quantity', { where: { type: 'out', ...movementDateFilter } }),
    ]);
    const lowStockProducts = inventory.filter((product) => Number(product.quantity) <= Number(product.reorderPoint));

    return sendSuccess(response, {
      data: {
        totalProducts,
        lowStockCount: lowStockProducts.length,
        stockInQuantity: Number(stockInQuantity || 0),
        stockOutQuantity: Number(stockOutQuantity || 0),
        lowStockProducts,
      },
    });
  } catch (error) {
    return handleControllerError(response, error, 'Unable to retrieve the dashboard summary.');
  }
}

export async function getReceiptReport(request, response) {
  try {
    const receipts = await StockReceipt.findAll({
      where: getDateFilter(request.query, 'receivedAt'),
      include: receiptIncludes,
      order: [['receivedAt', 'DESC']],
    });
    return sendSuccess(response, { data: receipts });
  } catch (error) {
    return handleControllerError(response, error, 'Unable to retrieve the stock receipt report.');
  }
}

export async function getIssueReport(request, response) {
  try {
    const issues = await StockIssue.findAll({
      where: getDateFilter(request.query, 'issuedAt'),
      include: issueIncludes,
      order: [['issuedAt', 'DESC']],
    });
    return sendSuccess(response, { data: issues });
  } catch (error) {
    return handleControllerError(response, error, 'Unable to retrieve the stock issue report.');
  }
}

export async function getInventoryReport(request, response) {
  try {
    const products = await Product.findAll({
      where: request.query.includeInactive === true || request.query.includeInactive === 'true' ? {} : { isActive: true },
      include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: Unit, attributes: ['id', 'name', 'abbreviation'] },
        { model: Supplier, attributes: ['id', 'code', 'name'] },
      ],
      order: [['name', 'ASC']],
    });
    return sendSuccess(response, { data: products });
  } catch (error) {
    return handleControllerError(response, error, 'Unable to retrieve the inventory report.');
  }
}
