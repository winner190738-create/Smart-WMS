import bcrypt from 'bcrypt';
import { User } from '../models/index.js';
import { sendFailure, sendSuccess } from '../utils/apiResponse.js';
import handleControllerError from '../utils/controllerError.js';

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function getUserPayload(body = {}, { includePassword = false } = {}) {
  const fields = ['name', 'email', 'role', 'isActive'];
  const payload = fields.reduce((result, field) => {
    if (Object.hasOwn(body, field)) {
      result[field] = body[field];
    }
    return result;
  }, {});
  if (includePassword && typeof body.password === 'string' && body.password) {
    payload.passwordHash = body.password;
  }
  return payload;
}

export async function listUsers(request, response) {
  try {
    const users = await User.findAll({ order: [['name', 'ASC']] });
    return sendSuccess(response, { data: users.map(serializeUser) });
  } catch (error) {
    return handleControllerError(response, error, 'Unable to retrieve users.');
  }
}

export async function getUser(request, response) {
  try {
    const user = await User.findByPk(request.params.id);
    if (!user) {
      return sendFailure(response, { status: 404, message: 'User was not found.' });
    }
    return sendSuccess(response, { data: serializeUser(user) });
  } catch (error) {
    return handleControllerError(response, error, 'Unable to retrieve the user.');
  }
}

export async function createUser(request, response) {
  try {
    const payload = getUserPayload(request.body, { includePassword: true });
    if (!payload.passwordHash) {
      return sendFailure(response, { status: 400, message: 'Password is required.' });
    }
    payload.passwordHash = await bcrypt.hash(payload.passwordHash, saltRounds);
    const user = await User.create(payload);
    return sendSuccess(response, { status: 201, message: 'User created successfully.', data: serializeUser(user) });
  } catch (error) {
    return handleControllerError(response, error, 'Unable to create the user.');
  }
}

export async function updateUser(request, response) {
  try {
    const user = await User.findByPk(request.params.id);
    if (!user) {
      return sendFailure(response, { status: 404, message: 'User was not found.' });
    }
    const payload = getUserPayload(request.body, { includePassword: true });
    if (payload.passwordHash) {
      payload.passwordHash = await bcrypt.hash(payload.passwordHash, saltRounds);
    }
    await user.update(payload);
    return sendSuccess(response, { message: 'User updated successfully.', data: serializeUser(user) });
  } catch (error) {
    return handleControllerError(response, error, 'Unable to update the user.');
  }
}

export async function deleteUser(request, response) {
  try {
    if (String(request.user.id) === String(request.params.id)) {
      return sendFailure(response, { status: 400, message: 'You cannot delete your own account.' });
    }
    const user = await User.findByPk(request.params.id);
    if (!user) {
      return sendFailure(response, { status: 404, message: 'User was not found.' });
    }
    await user.destroy();
    return sendSuccess(response, { message: 'User deleted successfully.' });
  } catch (error) {
    return handleControllerError(response, error, 'Unable to delete the user.');
  }
}
