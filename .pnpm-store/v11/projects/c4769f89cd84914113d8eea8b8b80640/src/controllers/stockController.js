import { randomUUID } from 'node:crypto';
import { Op } from 'sequelize';
import {
  Product,
  sequelize,
  StockIssue,
  StockIssueItem,
  StockMovement,
  StockReceipt,
  StockReceiptItem,
  Supplier,
  User,
} from '../models/index.js';
import { sendFailure, sendSuccess } from '../utils/apiResponse.js';
import handleControllerError from '../utils/controllerError.js';

class RequestError extends Error {}

const receiptIncludes = [
  { model: Supplier, attributes: ['id', 'code', 'name'] },
  { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
  { model: StockReceiptItem, as: 'items', include: [{ model: Product, attributes: ['id', 'code', 'name'] }] },
];

const issueIncludes = [
  { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
  { model: StockIssueItem, as: 'items', include: [{ model: Product, attributes: ['id', 'code', 'name'] }] },
];

function createDocumentNumber(prefix) {
  return `${prefix}-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

function getStockItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new RequestError('At least one stock item is required.');
  }

  return items.map((item) => {
    const productId = Number(item.productId);
    const quantity = Number(item.quantity);
    const unitCost = item.unitCost === undefined ? 0 : Number(item.unitCost);
    if (!Number.isInteger(productId) || productId < 1 || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(unitCost) || unitCost < 0) {
      throw new RequestError('Each stock item must contain a valid product, quantity, and unit cost.');
    }
    return { productId, quantity, unitCost };
  });
}

function parseDate(value, fieldName) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    throw new RequestError(`${fieldName} must be a valid date.`);
  }
  return date;
}

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

function handleStockError(response, error, fallbackMessage) {
  if (error instanceof RequestError) {
    return sendFailure(response, { status: 400, message: error.message });
  }
  return handleControllerError(response, error, fallbackMessage);
}

export async function listReceipts(request, response) {
  try {
    const receipts = await StockReceipt.findAll({
      where: getDateFilter(request.query, 'receivedAt'),
      include: receiptIncludes,
      order: [['receivedAt', 'DESC']],
    });
    return sendSuccess(response, { data: receipts });
  } catch (error) {
    return handleStockError(response, error, 'Unable to retrieve stock receipts.');
  }
}

export async function getReceipt(request, response) {
  try {
    const receipt = await StockReceipt.findByPk(request.params.id, { include: receiptIncludes });
    if (!receipt) {
      return sendFailure(response, { status: 404, message: 'Stock receipt was not found.' });
    }
    return sendSuccess(response, { data: receipt });
  } catch (error) {
    return handleStockError(response, error, 'Unable to retrieve the stock receipt.');
  }
}

export async function createReceipt(request, response) {
  try {
    const supplierId = Number(request.body?.supplierId);
    if (!Number.isInteger(supplierId) || supplierId < 1) {
      throw new RequestError('A valid supplier is required.');
    }
    const items = getStockItems(request.body?.items);
    const receivedAt = parseDate(request.body?.receivedAt, 'Received date');
    const note = typeof request.body?.note === 'string' ? request.body.note.trim() : null;

    const receiptId = await sequelize.transaction(async (transaction) => {
      const supplier = await Supplier.findOne({ where: { id: supplierId, isActive: true }, transaction });
      if (!supplier) {
        throw new RequestError('Supplier was not found or is inactive.');
      }
      const receipt = await StockReceipt.create({
        receiptNo: createDocumentNumber('RCV'),
        supplierId,
        receivedAt,
        note,
        createdBy: request.user.id,
      }, { transaction });

      for (const item of items) {
        const product = await Product.findOne({
          where: { id: item.productId, isActive: true },
          transaction,
          lock: transaction.LOCK.UPDATE,
        });
        if (!product) {
          throw new RequestError(`Product ${item.productId} was not found or is inactive.`);
        }
        await StockReceiptItem.create({ receiptId: receipt.id, ...item }, { transaction });
        await product.increment('quantity', { by: item.quantity, transaction });
        await StockMovement.create({
          type: 'in',
          quantity: item.quantity,
          referenceType: 'receipt',
          referenceId: receipt.id,
          productId: product.id,
          performedBy: request.user.id,
          occurredAt: receivedAt,
          note,
        }, { transaction });
      }

      return receipt.id;
    });

    const receipt = await StockReceipt.findByPk(receiptId, { include: receiptIncludes });
    return sendSuccess(response, { status: 201, message: 'Stock receipt created successfully.', data: receipt });
  } catch (error) {
    return handleStockError(response, error, 'Unable to create the stock receipt.');
  }
}

export async function listIssues(request, response) {
  try {
    const issues = await StockIssue.findAll({
      where: getDateFilter(request.query, 'issuedAt'),
      include: issueIncludes,
      order: [['issuedAt', 'DESC']],
    });
    return sendSuccess(response, { data: issues });
  } catch (error) {
    return handleStockError(response, error, 'Unable to retrieve stock issues.');
  }
}

export async function getIssue(request, response) {
  try {
    const issue = await StockIssue.findByPk(request.params.id, { include: issueIncludes });
    if (!issue) {
      return sendFailure(response, { status: 404, message: 'Stock issue was not found.' });
    }
    return sendSuccess(response, { data: issue });
  } catch (error) {
    return handleStockError(response, error, 'Unable to retrieve the stock issue.');
  }
}

export async function createIssue(request, response) {
  try {
    const items = getStockItems(request.body?.items);
    const issuedAt = parseDate(request.body?.issuedAt, 'Issue date');
    const requester = typeof request.body?.requester === 'string' ? request.body.requester.trim() : null;
    const note = typeof request.body?.note === 'string' ? request.body.note.trim() : null;

    const issueId = await sequelize.transaction(async (transaction) => {
      const issue = await StockIssue.create({
        issueNo: createDocumentNumber('ISS'),
        issuedAt,
        requester,
        note,
        createdBy: request.user.id,
      }, { transaction });

      for (const item of items) {
        const product = await Product.findOne({
          where: { id: item.productId, isActive: true },
          transaction,
          lock: transaction.LOCK.UPDATE,
        });
        if (!product) {
          throw new RequestError(`Product ${item.productId} was not found or is inactive.`);
        }
        if (Number(product.quantity) < item.quantity) {
          throw new RequestError(`Insufficient stock for product ${product.code}.`);
        }
        await StockIssueItem.create({ issueId: issue.id, productId: item.productId, quantity: item.quantity }, { transaction });
        await product.decrement('quantity', { by: item.quantity, transaction });
        await StockMovement.create({
          type: 'out',
          quantity: item.quantity,
          referenceType: 'issue',
          referenceId: issue.id,
          productId: product.id,
          performedBy: request.user.id,
          occurredAt: issuedAt,
          note,
        }, { transaction });
      }

      return issue.id;
    });

    const issue = await StockIssue.findByPk(issueId, { include: issueIncludes });
    return sendSuccess(response, { status: 201, message: 'Stock issue created successfully.', data: issue });
  } catch (error) {
    return handleStockError(response, error, 'Unable to create the stock issue.');
  }
}
