import { Op } from 'sequelize';
import { Category, Product, Supplier, Unit } from '../models/index.js';
import { sendFailure, sendSuccess } from '../utils/apiResponse.js';
import handleControllerError from '../utils/controllerError.js';

const productFields = [
  'code',
  'barcode',
  'name',
  'imageUrl',
  'reorderPoint',
  'categoryId',
  'unitId',
  'supplierId',
  'isActive',
];

const productIncludes = [
  { model: Category, attributes: ['id', 'name'] },
  { model: Unit, attributes: ['id', 'name', 'abbreviation'] },
  { model: Supplier, attributes: ['id', 'code', 'name'] },
];

function getPayload(body = {}) {
  return productFields.reduce((payload, field) => {
    if (Object.hasOwn(body, field)) {
      payload[field] = body[field];
    }
    return payload;
  }, {});
}

function buildWhere(query) {
  const where = {};
  if (query.includeInactive !== true && query.includeInactive !== 'true') {
    where.isActive = true;
  }
  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }
  if (query.supplierId) {
    where.supplierId = query.supplierId;
  }
  if (query.search) {
    const term = `%${query.search.trim()}%`;
    where[Op.or] = [{ code: { [Op.like]: term } }, { barcode: { [Op.like]: term } }, { name: { [Op.like]: term } }];
  }
  return where;
}

export async function listProducts(request, response) {
  try {
    const products = await Product.findAll({
      where: buildWhere(request.query),
      include: productIncludes,
      order: [['name', 'ASC']],
    });
    return sendSuccess(response, { data: products });
  } catch (error) {
    return handleControllerError(response, error, 'Unable to retrieve products.');
  }
}

export async function getProduct(request, response) {
  try {
    const product = await Product.findByPk(request.params.id, { include: productIncludes });
    if (!product) {
      return sendFailure(response, { status: 404, message: 'Product was not found.' });
    }
    return sendSuccess(response, { data: product });
  } catch (error) {
    return handleControllerError(response, error, 'Unable to retrieve the product.');
  }
}

export async function createProduct(request, response) {
  try {
    const product = await Product.create(getPayload(request.body));
    await product.reload({ include: productIncludes });
    return sendSuccess(response, { status: 201, message: 'Product created successfully.', data: product });
  } catch (error) {
    return handleControllerError(response, error, 'Unable to create the product.');
  }
}

export async function updateProduct(request, response) {
  try {
    const product = await Product.findByPk(request.params.id);
    if (!product) {
      return sendFailure(response, { status: 404, message: 'Product was not found.' });
    }
    await product.update(getPayload(request.body));
    await product.reload({ include: productIncludes });
    return sendSuccess(response, { message: 'Product updated successfully.', data: product });
  } catch (error) {
    return handleControllerError(response, error, 'Unable to update the product.');
  }
}

export async function deleteProduct(request, response) {
  try {
    const product = await Product.findByPk(request.params.id);
    if (!product) {
      return sendFailure(response, { status: 404, message: 'Product was not found.' });
    }
    await product.destroy();
    return sendSuccess(response, { message: 'Product deleted successfully.' });
  } catch (error) {
    return handleControllerError(response, error, 'Unable to delete the product.');
  }
}
