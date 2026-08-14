import { sendFailure, sendSuccess } from '../utils/apiResponse.js';
import handleControllerError from '../utils/controllerError.js';

function getPayload(body = {}, fields) {
  return fields.reduce((payload, field) => {
    if (Object.hasOwn(body, field)) {
      payload[field] = body[field];
    }
    return payload;
  }, {});
}

export function createResourceController({ Model, resourceName, fields, order = [['id', 'DESC']] }) {
  async function list(request, response) {
    try {
      const records = await Model.findAll({ order });
      return sendSuccess(response, { data: records });
    } catch (error) {
      return handleControllerError(response, error, `Unable to retrieve ${resourceName}.`);
    }
  }

  async function getById(request, response) {
    try {
      const record = await Model.findByPk(request.params.id);
      if (!record) {
        return sendFailure(response, { status: 404, message: `${resourceName} was not found.` });
      }
      return sendSuccess(response, { data: record });
    } catch (error) {
      return handleControllerError(response, error, `Unable to retrieve the ${resourceName}.`);
    }
  }

  async function create(request, response) {
    try {
      const record = await Model.create(getPayload(request.body, fields));
      return sendSuccess(response, { status: 201, message: `${resourceName} created successfully.`, data: record });
    } catch (error) {
      return handleControllerError(response, error, `Unable to create the ${resourceName}.`);
    }
  }

  async function update(request, response) {
    try {
      const record = await Model.findByPk(request.params.id);
      if (!record) {
        return sendFailure(response, { status: 404, message: `${resourceName} was not found.` });
      }
      await record.update(getPayload(request.body, fields));
      return sendSuccess(response, { message: `${resourceName} updated successfully.`, data: record });
    } catch (error) {
      return handleControllerError(response, error, `Unable to update the ${resourceName}.`);
    }
  }

  async function remove(request, response) {
    try {
      const record = await Model.findByPk(request.params.id);
      if (!record) {
        return sendFailure(response, { status: 404, message: `${resourceName} was not found.` });
      }
      await record.destroy();
      return sendSuccess(response, { message: `${resourceName} deleted successfully.` });
    } catch (error) {
      return handleControllerError(response, error, `Unable to delete the ${resourceName}.`);
    }
  }

  return { list, getById, create, update, remove };
}
